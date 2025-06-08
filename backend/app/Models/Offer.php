<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model {
  protected $fillable = ['recruiter_id','title','description'];

  public function recruiter() {
    return $this->belongsTo(User::class,'recruiter_id');
  }
  public function applications() {
    return $this->hasMany(Application::class);
  }
}
