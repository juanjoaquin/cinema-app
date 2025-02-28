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

        $totalPrice = $tickets->sum('price');

        return response()->json([
            'message' => 'Filtered ticket history retrieved successfully',
            'historial' => $tickets,
            'total_price' => $totalPrice,
        ], 200);
    }

    public function storeTicket(Request $request)
    {
        $validated = $request->validate([
            'schedule_id' => 'required|exists:movie_schedules,id',
            'seat_id' => 'required|array',
            'seat_id.*' => 'exists:seats,id',

        ]);

        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $tickets = [];

        foreach ($validated['seat_id'] as $seatId) {
            $existingTicket = Ticket::where('schedule_id', $validated['schedule_id'])
                ->where('seat_id', $seatId)
                ->whereIn('status', ['pending', 'paid'])
                ->first();

            if ($existingTicket) {
                return response()->json(['error' => 'Uno de los asientos ya ha sido reservado'], 400);
            }


            $schedule = MovieSchedule::findOrFail($validated['schedule_id']);
            $movie = $schedule->movie;


            $ticket = Ticket::create([
                'user_id' => $user->id,
                'schedule_id' => $validated['schedule_id'],
                'seat_id' => $seatId,
                'price' => $movie->price,
                'status' => 'pending',

            ]);

            $tickets[] = $ticket;
        }

        return response()->json([
            'message' => 'Tickets creados con éxito',
            'tickets' => $tickets,
        ], 201);
    }


    public function storePayment(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|array',
            'ticket_id.*' => 'exists:tickets,id',
            'payment_method' => 'required|in:credit_card,debit_card',
            'card_name' => 'required|string',
            'card_number' => 'required|string',
            'card_expiration' => 'required|string',
            'card_cvv' => 'required|string',
        ]);

        $tickets = Ticket::whereIn('id', $validated['ticket_id'])->get();

        foreach ($tickets as $ticket) {
            if ($ticket->status === 'paid') {
                return response()->json(['error' => 'Uno o más tickets ya han sido pagados'], 400);
            }
        }

        $totalAmount = $tickets->sum('price');

        $payment = Payment::create([
            'user_id' => $tickets->first()->user_id,
            'amount' => $totalAmount,
            'payment_method' => $validated['payment_method'],
            'card_name' => $validated['card_name'],
            'card_number' => $validated['card_number'],
            'card_expiration' => $validated['card_expiration'],
            'card_cvv' => $validated['card_cvv'],
            'status' => 'completed',
        ]);

        $payment->tickets()->attach($tickets);

        foreach ($tickets as $ticket) {
            $ticket->update(['status' => 'paid']);

            $seat = Seat::find($ticket->seat_id);
            if ($seat) {
                $seat->update(['status' => false]);
            }
        }

        return response()->json([
            'message' => 'Pago realizado con éxito para todos los tickets',
            'payment' => $payment,
        ], 201);
    }

    public function refund($ticket_id) //fixeado
    {
        $ticket = Ticket::findOrFail($ticket_id);

        if ($ticket->status !== 'paid') {
            return response()->json(['error' => 'The ticket cannot be refunded.'], 400);
        }

        $purchaseTime = $ticket->created_at;
        $now = now();
        $timeDifference = $now->diffInMinutes($purchaseTime);

        if ($timeDifference > 10) {
            return response()->json(['error' => 'Refund is only available within 10 minutes of purchase.'], 400);
        }

        $payment = $ticket->payments()->first();

        $ticket->update(['status' => 'canceled']);

        $seat = Seat::find($ticket->seat_id);
        if ($seat) {
            $seat->update(['status' => true]);
        }

        return response()->json([
            'message' => 'Refund processed successfully and seat released.',
            'ticket' => $ticket,
            'payment' => $payment,
            'seat' => $seat
        ], 200);
    }

    // Esta es la que uso!!
    // public function refund($ticket_id)
    // {
    //     $ticket = Ticket::findOrFail($ticket_id);

    //     // Verificar que el ticket esté pagado antes de reembolsarlo
    //     if ($ticket->status !== 'paid') {
    //         return response()->json(['error' => 'El ticket no puede ser reembolsado'], 400);
    //     }

    //     // Buscar el pago relacionado con el ticket
    //     $payment = $ticket->payments()->first(); // Usar relación en lugar de consulta manual

    //     // Cambiar estado del ticket a cancelado
    //     $ticket->update(['status' => 'canceled']);

    //     // Liberar el asiento cambiando su estado a "available"
    //     $seat = Seat::find($ticket->seat_id);
    //     if ($seat) {
    //         $seat->update(['status' => true]);
    //     }

    //     return response()->json([
    //         'message' => 'Reembolso realizado con éxito y asiento liberado',
    //         'ticket' => $ticket,
    //         'payment' => $payment, // Devuelve el pago asociado
    //         'seat' => $seat
    //     ], 200);
    // }


    // public function refund($ticket_id)
    // {
    //     $ticket = Ticket::findOrFail($ticket_id);

    //     // Verificar que el ticket esté pagado antes de reembolsarlo
    //     if ($ticket->status !== 'paid') {
    //         return response()->json(['error' => 'El ticket no puede ser reembolsado'], 400);
    //     }

    //     // Buscar el pago relacionado con el ticket
    //     $payment = Payment::where('ticket_id', $ticket->id)->first();

    //     if (!$payment || $payment->status !== 'completed') {
    //         return response()->json(['error' => 'No se encontró un pago válido para este ticket'], 400);
    //     }

    //     // Cambiar estado del ticket a cancelado
    //     $ticket->update(['status' => 'canceled']);

    //     // Liberar el asiento cambiando su estado a "available"
    //     $seat = Seat::find($ticket->seat_id);
    //     if ($seat) {
    //         $seat->update(['status' => true]);
    //     }

    //     return response()->json([
    //         'message' => 'Reembolso realizado con éxito y asiento liberado',
    //         'ticket' => $ticket,
    //         'payment' => $payment,
    //         'seat' => $seat
    //     ], 200);
    // }
}
