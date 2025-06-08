<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use App\Models\Offer;
use App\Models\Report;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    
    public function getStats(Request $request)
    {
        $totalUsers = User::count();

        $oneWeekAgo = Carbon::now()->subDays(7);
        $newUsers = User::where("created_at", ">=", $oneWeekAgo)->count();

        $totalOffers = Offer::count();

        $totalMessages = Message::count();

        return response()->json([
            "total_users" => $totalUsers,
            "new_users_last_week" => $newUsers,
            "total_offers" => $totalOffers,
            "total_messages" => $totalMessages,
        ]);
    }

    public function getReports()
    {
        $reports = Report::with([
            'reporter:id,name,email',
            'application.candidate:id,name,email'
        ])->get();

        $payload = $reports->map(function($r) {
            return [
                'id'             => $r->id,
                'reason'         => $r->message,
                'reportedBy'     => $r->reporter,
                'reportedUser'   => $r->application->candidate,
                'reportedUserRole' => $r->application->candidate ? 'candidate' : 'recruiter'
            ];
        });

        return response()->json($payload);
    }


    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(["message" => "Usuario no encontrado."], 404);
        }

        $user->delete();

        return response()->json(["message" => "Usuario eliminado correctamente."]);
    }
}
