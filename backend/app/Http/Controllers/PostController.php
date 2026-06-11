<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'body'     => 'required|string',
            'author'   => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'status'   => 'required|in:published,draft',
        ]);

        $post = Post::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($post, 201);
    }

    public function show(Request $request, Post $post)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($post);
    }

    public function update(Request $request, Post $post)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'    => 'sometimes|required|string|max:255',
            'body'     => 'sometimes|required|string',
            'author'   => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'status'   => 'sometimes|required|in:published,draft',
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Request $request, Post $post)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
