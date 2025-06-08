<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'offer_id' => 'required|integer|exists:offers,id',
            'message'  => 'required|string|max:2000',
        ]);

        $user = $request->user();

        $report = Report::create([
            'offer_id'      => $data['offer_id'],
            'reported_by'   => $user->id,
            'message'       => $data['message'],
        ]);

        return response()->json([
            'success' => true,
            'report'  => $report,
        ], 201);
    }

    public function index()
{
    $reports = Report::with([
        'reporter:id,name,email',
        'application.candidate:id,name,email'
    ])->get();

    return response()->json($reports->map(function($r) {
        return [
            'id'             => $r->id,
            'reason'         => $r->message,
            'reportedBy'     => $r->reporter,
            'reportedUser'   => $r->application->candidate,
            'reportedUserRole' => $r->application->candidate ? 'candidate' : 'recruiter'
        ];
    }));
}
}
