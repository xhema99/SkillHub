<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateController extends Controller
{
    
    public function index(Request $request)
    {
        return Application::with('offer')
            ->where('candidate_id', $request->user()->id)
            ->get();
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'offer_id' => 'required|exists:offers,id',
            'cv'       => 'required|file|mimes:pdf'
        ]);

        $path = $request->file('cv')->store('cvs');

        $application = Application::create([
            'offer_id'     => $request->input('offer_id'),
            'candidate_id' => $request->user()->id,
            'cv_path'      => $path,
            'status'       => 'pending',
        ]);

        return response()->json($application, 201);
    }

    
    public function download(Request $request, Application $application)
    {
        $user = $request->user();

        if ($user->id !== $application->candidate_id
            && $user->id !== $application->offer->recruiter_id) {
            abort(403, 'No autorizado');
        }

        return Storage::download($application->cv_path);
    }

    public function destroy(User $candidate)
    {
        $candidate->delete();
        return response()->json(['message'=>'Candidato eliminado'], Response::HTTP_OK);
    }
}
