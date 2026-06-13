<?php

namespace App\Models;

use CodeIgniter\Model;

class PortfolioModel extends Model
{
    protected $table = 'portfolio';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'title',
        'description',
        'project_url',
        'skills',
        'id_lang',
        'status',
        'item',
        'main_portfolio_id',
    ];
    protected $useTimestamps = true;
}
