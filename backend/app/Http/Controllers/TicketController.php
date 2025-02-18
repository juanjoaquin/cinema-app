<?php

namespace App\Http\Controllers;

use App\Models\MovieSchedule;
use App\Models\Payment;
use App\Models\Seat;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{


    public function getHistorial(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }


        $tickets = Ticket::where('user_id', $user->id)
            ->where('status', 'paid')
            ->with('schedule.movie')
            ->get()
            ->map(function ($ticket) {
                return [
                    'ticket_id' => $ticket->id,
                    'title' => $ticket->schedule->movie->title,
                    'price' => $ticket->price,
                    'status' => $ticket->status,
                    'seats' => $ticket->seat,
                ];
            });

        if ($tickets->isEmpty()) {
            return response()->json([
                'message' => 'Dont have historial yet'
            ], 404);
        }

        return response()->json([
            'message' => 'Filtered ticket history retrieved successfully',
            'historial' => $tickets,
        ], 200);
    }

    public function storeTicket(Request $request)
    {
        $validated = $request->validate([
            'schedule_id' => 'required|exists:movie_schedules,id',
            'seat_id' => 'required|array', // Asegurarse que seat_id es un array
            'seat_id.*' => 'exists:seats,id', // Cada asiento debe existir
            'user_id' => 'required|exists:users,id', // Validar user_id si es necesario
        ]);

        $tickets = []; // Para almacenar los tickets creados

        foreach ($validated['seat_id'] as $seatId) {
            // Verificar si ya hay un ticket con ese asiento en el mismo horario
            $existingTicket = Ticket::where('schedule_id', $validated['schedule_id'])
                ->where('seat_id', $seatId)
                ->whereIn('status', ['pending', 'paid'])
                ->first();

            if ($existingTicket) {
                return response()->json(['error' => 'Uno de los asientos ya ha sido reservado'], 400);
            }

            // Obtener el precio de la película
            $schedule = MovieSchedule::findOrFail($validated['schedule_id']);
            $movie = $schedule->movie;

            // Crear el ticket para el asiento
            $ticket = Ticket::create([
                'user_id' => $validated['user_id'],
                'schedule_id' => $validated['schedule_id'],
                'seat_id' => $seatId,
                'price' => $movie->price,
                'status' => 'pending',
            ]);

            // Agregar ticket a la lista
            $tickets[] = $ticket;
        }

        return response()->json([
            'message' => 'Tickets creados con éxito',
            'tickets' => $tickets,
        ], 201);
    }

    // public function storeTicket(Request $request)
    // {
    //     $validated = $request->validate([
    //         'schedule_id' => 'required|exists:movie_schedules,id',
    //         'seat_id' => 'required|exists:seats,id',
    //         'user_id' => 'required|exists:users,id',
    //     ]);

    //     // Verificar si ya hay un ticket con ese asiento en el mismo horario
    //     $existingTicket = Ticket::where('schedule_id', $validated['schedule_id'])
    //         ->where('seat_id', $validated['seat_id'])
    //         ->whereIn('status', ['pending', 'paid'])
    //         ->first();

    //     if ($existingTicket) {
    //         return response()->json(['error' => 'Este asiento ya ha sido reservado'], 400);
    //     }

    //     // Obtener el precio de la película
    //     $schedule = MovieSchedule::findOrFail($validated['schedule_id']);
    //     $movie = $schedule->movie;

    //     // Crear el ticket
    //     $ticket = Ticket::create([
    //         'user_id' => $validated['user_id'],
    //         'schedule_id' => $validated['schedule_id'],
    //         'seat_id' => $validated['seat_id'],
    //         'price' => $movie->price,
    //         'status' => 'pending',
    //     ]);

    //     return response()->json($ticket, 201);
    // }


    public function storePayment(Request $request)
    {
        // Validación de la solicitud
        $validated = $request->validate([
            'ticket_id' => 'required|array',
            'ticket_id.*' => 'exists:tickets,id',
            'payment_method' => 'required|in:credit_card,debit_card',
            'card_name' => 'required|string',
            'card_number' => 'required|string',
            'card_expiration' => 'required|string',
            'card_cvv' => 'required|string',
        ]);
    
        // Obtener todos los tickets seleccionados
        $tickets = Ticket::whereIn('id', $validated['ticket_id'])->get();
    
        // Verificar si algún ticket ya ha sido pagado
        foreach ($tickets as $ticket) {
            if ($ticket->status === 'paid') {
                return response()->json(['error' => 'Uno o más tickets ya han sido pagados'], 400);
            }
        }
    
        // Calcular el monto total para el pago (sumar los precios de todos los tickets)
        $totalAmount = $tickets->sum('price');
    
        // Crear el pago con el monto total
        $payment = Payment::create([
            'user_id' => $tickets->first()->user_id,  // Usamos el usuario del primer ticket (todos deberían tener el mismo)
            'amount' => $totalAmount,  // Monto total por todos los tickets
            'payment_method' => $validated['payment_method'],
            'card_name' => $validated['card_name'],
            'card_number' => $validated['card_number'],
            'card_expiration' => $validated['card_expiration'],
            'card_cvv' => $validated['card_cvv'],
            'status' => 'completed',  // El pago se marca como completado
        ]);
    
        // Asociar los tickets con el pago
        $payment->tickets()->attach($tickets);
    
        // Actualizar el estado de todos los tickets a "paid"
        foreach ($tickets as $ticket) {
            $ticket->update(['status' => 'paid']);
        }
    
        return response()->json([
            'message' => 'Pago realizado con éxito para todos los tickets',
            'payment' => $payment,
        ], 201);
    }
    


    public function refund($ticket_id)
    {
        $ticket = Ticket::findOrFail($ticket_id);

        // Verificar que el ticket esté pagado antes de reembolsarlo
        if ($ticket->status !== 'paid') {
            return response()->json(['error' => 'El ticket no puede ser reembolsado'], 400);
        }

        // Buscar el pago relacionado con el ticket
        $payment = Payment::where('ticket_id', $ticket->id)->first();

        if (!$payment || $payment->status !== 'completed') {
            return response()->json(['error' => 'No se encontró un pago válido para este ticket'], 400);
        }

        // Cambiar estado del ticket a cancelado
        $ticket->update(['status' => 'canceled']);

        // Liberar el asiento cambiando su estado a "available"
        $seat = Seat::find($ticket->seat_id);
        if ($seat) {
            $seat->update(['status' => true]);
        }

        return response()->json([
            'message' => 'Reembolso realizado con éxito y asiento liberado',
            'ticket' => $ticket,
            'payment' => $payment,
            'seat' => $seat
        ], 200);
    }
}
