<?php 
namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthFilter implements FilterInterface {
    public function before(RequestInterface $request, $arguments = null) {
        // Omitir la verificación de autenticación para solicitudes OPTIONS
        if ($request->getMethod() === 'options') {
            return; // Permite que la solicitud OPTIONS continúe sin autenticación
        }

        $authHeader = $request->getHeaderLine('Authorization');
        $arr = explode(' ', $authHeader);
        $token = $arr[1] ?? '';

        if (!$token) {
            return service('response')->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED, 'Token not provided');
        }

        try {
            JWT::decode($token, new Key(env('JWT_SECRET_KEY'), 'HS256'));
            // La solicitud puede continuar si el token es válido
        } catch (\Exception $e) {
            log_message('error', 'JWT Error: ' . $e->getMessage());
            return service('response')->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED, 'Invalid token: ' . $e->getMessage());
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {
        // No es necesario implementar este método para la autenticación
    }
}
