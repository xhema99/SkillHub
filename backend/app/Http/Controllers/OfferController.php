<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offer;

class OfferController extends Controller
{
  public function index(Request $req)
  {
    $q = $req->query('search');
    $query = Offer::query();
    if ($q) {
      $query->where('title','like',"%{$q}%")
            ->orWhere('description','like',"%{$q}%");
    }
    return response()->json($query->get());
  }
  public function show(Offer $offer)
    {
    return response()->json($offer);
    }
}
