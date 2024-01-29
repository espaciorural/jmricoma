<?php
namespace App\Models;

use CodeIgniter\Model;

class AccessModel extends Model {
    protected $table = 'access';
    protected $primaryKey = 'id';
    protected $allowedFields = ['username', 'password'];

    public function verificarUsuario($username, $password) {
        $user = $this->where('username', $username)->first();
    
        if ($user) {
            if (password_verify($password, $user['password'])) {
                return $user; 
            }
        }
    
        return false;
    }
    
}
