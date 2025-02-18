<?php

namespace App\Http\Controllers;

use App\Models\Seat;
use Illuminate\Http\Request;

class SeatsController extends Controller
{

    public function index()
    {
        $seats = Seat::all();

        if ($seats->isEmpty()) {
            return response()->json([
                'message' => 'Rooms not found'
            ], 404);
        }

        return response()->json($seats, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'row' => 'required|string|max:1',
            'number' => 'required|integer|min:1',
            'status' => 'boolean'
        ]);

        $seat = Seat::create([
            'room_id' => $validated['room_id'],
            'row' => $validated['row'],
            'number' => $validated['number'],
            'status' => $validated['status']
        ]);

        return response()->json($seat, 201);
    }
}
