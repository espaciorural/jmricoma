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
        'id_lang',
        'status',
        'main_portfolio_id',
    ];
    protected $useTimestamps = true;
}
