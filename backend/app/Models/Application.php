<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Application extends Model {
  protected $fillable = [
  'offer_id',
  'candidate_id',
  'cv_path',
  'status',
];

  public function candidate() {
    return $this->belongsTo(User::class,'candidate_id');
  }
  public function offer() {
    return $this->belongsTo(Offer::class);
  }
}
