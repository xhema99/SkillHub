<?php

namespace App\Http\Controllers\Recruiter;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function store(Request $req)
    {
        $data = $req->validate([
          'offer_id'     => 'required|exists:offers,id',
          'candidate_id' => 'required|exists:users,id',
        ]);

        $chat = Chat::create($data);

        return response()->json($chat, 201);
    }

    public function show($id)
    {
        $chat = Chat::with('messages.user')->findOrFail($id);
        return response()->json($chat->messages);
    }

    public function message(Request $req, $id)
    {
        $req->validate([
          'body' => 'required|string',
        ]);

        $message = $chat->messages()->create([
          'user_id' => auth()->id(),
          'body'    => $req->body,
        ]);

        return response()->json($message, 201);
    }
}