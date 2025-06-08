<?php

namespace App\Http\Controllers;
use App\Models\Offer;
use Illuminate\Http\Request;

class RecruiterController extends Controller
{
    public function index(Request $req)
    {
      $offers = Offer::withCount('applications')
        ->where('recruiter_id', $req->user()->id)
        ->get();
      return response()->json($offers);
    }

    public function store(Request $req)
    {
      $data = $req->validate([
        'title'       => 'required|string',
        'description' => 'nullable|string',
      ]);
      $data['recruiter_id'] = $req->user()->id;
      $offer = Offer::create($data);
      return response()->json($offer, 201);
    }

    public function applications($offerId, Request $req)
    {
      $offer = Offer::findOrFail($offerId);
      if ($offer->recruiter_id !== $req->user()->id) {
        abort(403);
      }
      $apps = $offer->applications()->with('candidate')->get();
      return response()->json($apps);
    }

    public function destroy(User $recruiter)
    {
        $recruiter->delete();
        return response()->json(['message'=>'Reclutador eliminado'], Response::HTTP_OK);
    }
}
