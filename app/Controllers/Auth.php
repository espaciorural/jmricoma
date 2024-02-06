<?php namespace App\Controllers;

use CodeIgniter\Controller;

class Auth extends Controller {
    public function login() {
        $request = service('request');
        $json = $request->getJSON();
    
        if ($request->getMethod() === 'post') {
            $username = $json->username ?? '';
            $password = $json->password ?? '';
    
            // Carga el modelo AccessModel
            $accessModel = new \App\Models\AccessModel();
    
            // Verifica las credenciales del usuario
            if ($accessModel->verificarUsuario($username, $password)) {
                // Credenciales válidas
                return $this->response->setJSON(['success' => true]);
            } else {
                // Credenciales inválidas
                return $this->response->setJSON(['success' => false]);
            }
        }
    }
    
    public function options() {
        // No es necesario retornar nada, solo asegurarse de que
        // se envíen las cabeceras CORS adecuadas en la respuesta.
    }
    
}