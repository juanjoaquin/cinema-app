<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function schedules()
    {
        return $this->hasMany(MovieSchedule::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
