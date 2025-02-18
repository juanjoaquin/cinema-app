<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Movie;
use Illuminate\Http\Request;

class CommentsController extends Controller
{

    public function index()
    {
        $comments = Comment::all();

        if($comments->isEmpty()) {
            return response()->json([
                'message' => 'Comments not found'
            ], 404);
        }

        return response()->json($comments, 200);
    }

    public function show(string $id)
    {
        $comment = Comment::with('user', 'movie')->find($id);
    
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }
    
        return response()->json([
            'comment' => $comment
        ], 200);
    }

    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:1|max:255',
        ]);
    
        $user = auth()->user();
    
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $movie = Movie::find($id);
    
        if (!$movie) {
            return response()->json([
                'message' => 'Movie not found'
            ], 404);
        }
    
        $comment = Comment::create([
            'user_id' => $user->id, 
            'movie_id' => $id, 
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);
    
        return response()->json($comment, 201);

    }

    public function destroy(string $id)
    {

        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $comment = Comment::find($id);

        if ($comment->user_id !== $user->id) {
            return response()->json(['message' => 'You are not authorized to delete this comment'], 403);
        }

        if(!$comment) {
            return response()->json([
                'message' => 'Comment not found'
            ], 404);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted succesfully'
        ], 200);
    }
}
