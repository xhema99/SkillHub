<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id',
        'reported_by',
        'message',
    ];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function reporter() { return $this->belongsTo(User::class, 'reported_by'); }
    
    public function application() 
    { 
        return $this->belongsTo(Application::class); 
    }
}
