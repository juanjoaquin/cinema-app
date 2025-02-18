<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Http\Request;

class MoviesController extends Controller
{

    public function index()
    {
        $movies = Movie::all();

        if($movies->isEmpty()) {
            return response()->json([
                'message' => 'Movies not found'
            ], 404);
        }

        return response()->json($movies, 200);
    }

    public function getUsers()
    {
        $users = User::all();

        if($users->isEmpty()) {
            return response()->json([
                'message' => 'Movies not found'
            ], 404);
        }

        return response()->json($users, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3',
            'description' => 'required|string|min:3|max:255',
            'price' => 'required|integer',
            'duration' => 'required|integer',
            'image_path' => 'required|string|max:255',
            'genre' => 'required|string|min:3|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'release_date' => 'required|date'
        ]);

        $movie = Movie::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'duration' => $validated['duration'],
            'image_path' => $validated['image_path'],
            'genre' => $validated['genre'],
            'rating' => $validated['rating'],
            'release_date' => $validated['release_date'],

        ]);

        return response()->json($movie, 201);
    }

    public function updatePrice(Request $request, string $id)
    {
        $request->validate([
            'price' => 'required|integer'
        ]);

        $movie = Movie::find($id);

        if(!$movie) {
            return response()->json([
                'message' => 'Movie not found'
            ], 404);
        }

        $movie->price = $request->price;
        $movie->save();

        return response()->json([
            'message' => 'Movie price updated successfully',
            'movie' => $movie
        ], 200);

    }

    public function destroy(string $id)
    {
        $findMovie = Movie::find($id);

        if(!$findMovie) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        $findMovie->delete();

        return response()->json([
            'message' => 'Movie deleted succesfully'
        ], 200);
    }
}
