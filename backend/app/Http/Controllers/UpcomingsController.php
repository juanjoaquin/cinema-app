<?php

namespace App\Http\Controllers;

use App\Models\Upcoming;
use Illuminate\Http\Request;

class UpcomingsController extends Controller
{

    public function index()
    {
        $upcomings = Upcoming::all();

        if($upcomings->isEmpty()) {
            return response()->json([
                'message' => 'Movies not found'
            ], 404);
        }

        return response()->json([
            'upcomings' => $upcomings
        ], 200);
    }

    public function show(string $id)
    {
        $upcomingById = Upcoming::find($id);
    
        if (!$upcomingById) {
            return response()->json(['message' => 'Upcoming movies not found'], 404);
        }
    
        return response()->json([
            'upcomings' => $upcomingById
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3',
            'description' => 'required|string|min:3|max:255',
            'path_image' => 'required|string|max:255',
            'genre' => 'required|string|min:1',
        
        ]);

        $upcomings = Upcoming::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'path_image' => $validated['path_image'],
            'genre' => $validated['genre'],
        ]);

        return response()->json($upcomings, 201);
    }

}
