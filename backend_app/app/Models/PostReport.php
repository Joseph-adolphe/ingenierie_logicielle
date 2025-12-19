<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostReport extends Model
{
    //
    protected $table = 'post_reports';

    protected $fillable = [
        'post_id',
        'user_id',
        'raison',
    ];
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
