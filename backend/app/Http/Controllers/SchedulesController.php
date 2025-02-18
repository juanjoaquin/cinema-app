<?php

namespace App\Http\Controllers;

use App\Models\MovieSchedule;
use Illuminate\Http\Request;

class SchedulesController extends Controller
{

    
    public function index()
    {
        $movieSchedules = MovieSchedule::all();

        if($movieSchedules->isEmpty()) {
            return response()->json([
                'message' => 'Movies Schedules not found'
            ], 404);
        }

        return response()->json($movieSchedules, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'movie_id' => 'required|exists:movies,id',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
            'show_time' => 'required|date',
        ]);

        $movieSchedule = MovieSchedule::create([
            'room_id' => $validated['room_id'],
            'movie_id' => $validated['movie_id'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'show_time' => $validated['show_time'],

        ]);

        return response()->json($movieSchedule, 201);
    }
}
