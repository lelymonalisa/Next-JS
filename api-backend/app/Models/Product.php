<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        'title',
        'description',
        'banner_image',
        'cost',
        'user_id'
    ];
}
