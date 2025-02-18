<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomsController extends Controller
{

    public function index()
    {
        $rooms = Room::all();

        if($rooms->isEmpty()) {
            return response()->json([
                'message' => 'Rooms not found'
            ], 404);
        }

        return response()->json($rooms, 200);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:1|max:50',
        ]);

        $room = Room::create([
            'name' => $validated['name']

        ]);

        return response()->json($room, 201);
    }

    public function destroy(string $id)
    {
        $findRoom = Room::find($id);

        if(!$findRoom) {
            return response()->json([
                'message' => 'Room not found'
            ], 404);
        }

        $findRoom->delete();

        return response()->json([
            'message' => 'Room deleted succesfully'
        ], 200);
    }
}
