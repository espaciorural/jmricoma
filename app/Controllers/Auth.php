<?php
namespace App\Controllers;

use CodeIgniter\Controller;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth extends Controller {
    public function login() {
        $request = service('request');
        $json = $request->getJSON();

        // Recupera la clave secreta JWT
        $key = env('JWT_SECRET_KEY');
        
        // Verifica si la clave secreta JWT está vacía y registra un mensaje de error si es así
        if (empty($key)) {
            log_message('error', 'JWT Secret Key is not set or is empty.');
            // Considera retornar una respuesta o manejar el error adecuadamente aquí
            return $this->response->setJSON(['error' => 'JWT configuration error.']);
        }
    
        if ($request->getMethod() === 'post') {
            $username = $json->username ?? '';
            $password = $json->password ?? '';
    
            // Carga el modelo AccessModel
            $accessModel = new \App\Models\AccessModel();
    
            // Verifica las credenciales del usuario
            if ($user = $accessModel->verificarUsuario($username, $password)) {
                // Credenciales válidas, genera JWT

                $time = time();
                $payload = [
                    'iat' => $time, // Tiempo en que el token fue emitido
                    'exp' => $time + (60*60), // Expiración del token, p.ej., 1 hora
                    'sub' => $user['id'], // Sujeto del token, p.ej., el ID del usuario
                ];
                
                $jwt = JWT::encode($payload, $key, 'HS256');
                
                // Envía el JWT en una cookie httpOnly
                return $this->response->setJSON(['success' => true, 'token' => $jwt]);
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
