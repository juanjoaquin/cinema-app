<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->belongsTo(MovieSchedule::class);
    }

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }

    public function payments()
    {
        return $this->belongsToMany(Payment::class, 'payment_ticket');
    }

    public function price()
    {
        return $this->schedule->movie->price; 
    }
}
