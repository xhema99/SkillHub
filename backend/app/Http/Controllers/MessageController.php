<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Models\Application;


class MessageController extends Controller
{
    public function threadsRecruiter(Request $request)
    {
        $recruiterId = $request->user()->id;

        $summaries = Message::selectRaw('application_id, MAX(created_at) as last_time')
            ->whereHas('application.offer', function($q) use ($recruiterId) {
                $q->where('recruiter_id', $recruiterId);
            })
            ->groupBy('application_id')
            ->get();

        $threads = $summaries->map(function($row) {
            $lastMsg = Message::where('application_id', $row->application_id)
                              ->latest('created_at')
                              ->with('sender:id,name')
                              ->first();

            return [
                'application_id' => $row->application_id,
                'candidate'      => [
                    'name' => $row->application->candidate->name,
                ],
                'last_message'   => $lastMsg?->body,
                'last_from'      => $lastMsg?->sender->name,
                'last_at'        => $lastMsg?->created_at,
            ];
        });

        return response()->json($threads);
    }

    public function threadsCandidate(Request $request)
    {
        $candidateId = $request->user()->id;

        $summaries = Message::selectRaw('application_id, MAX(created_at) as last_time')
            ->whereHas('application', function($q) use ($candidateId) {
                $q->where('candidate_id', $candidateId);
            })
            ->groupBy('application_id')
            ->get();

        $threads = $summaries->map(function($row) {
            $lastMsg = Message::where('application_id', $row->application_id)
                              ->latest('created_at')
                              ->with('sender:id,name')
                              ->first();

            return [
                'application_id' => $row->application_id,
                'recruiter'      => [
                    'name' => $row->application->offer->recruiter->name,
                ],
                'last_message'   => $lastMsg?->body,
                'last_from'      => $lastMsg?->sender->name,
                'last_at'        => $lastMsg?->created_at,
            ];
        });

        return response()->json($threads);
    }


    public function index(Request $request, $applicationId)
    {
        $msgs = Message::where('application_id', $applicationId)
                       ->with('sender:id,name')
                       ->orderBy('created_at')
                       ->get();

        return response()->json($msgs);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'body'           => 'required|string',
        ]);

        $message = Message::create([
            'application_id' => $data['application_id'],
            'sender_id'      => $request->user()->id,
            'body'           => $data['body'],
        ]);

        $message->load('sender:id,name');

        return response()->json($message, 201);
    }
}
