<?php

namespace App\Models;

use CodeIgniter\Model;

class ServiceModel extends Model
{
    protected $table = 'services';
    protected $primaryKey = 'id';
    protected $allowedFields = ['title', 'description', 'id_lang', 'status', 'item', 'main_service_id'];
    protected $useTimestamps = true;
}
