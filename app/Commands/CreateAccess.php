<?php namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class CreateAccess extends BaseCommand {
    protected $group       = 'custom';
    protected $name        = 'create:access';
    protected $description = 'Crea un nuevo usuario en la base de datos.';

    public function run(array $params) {
        $username = CLI::prompt('Ingrese el nombre de usuario');
        $password = CLI::prompt('Ingrese la contraseña', true); // Cambio aquí
    
        $data = [
            'username' => $username,
            'password' => password_hash($password, PASSWORD_DEFAULT)
        ];
    
        $accessModel = new \App\Models\AccessModel();
        $accessModel->save($data);
    
        CLI::write('Usuario creado con éxito.', 'green');
    }
    
    
}