<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'application_id',
        'sender_id',
        'body',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
