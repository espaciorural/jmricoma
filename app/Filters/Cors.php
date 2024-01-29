<?php namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class Cors implements FilterInterface {
    public function before(RequestInterface $request, $arguments = null) {
        // No es necesario configurar nada antes de la petición
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {
        $response->setHeader('Access-Control-Allow-Origin', '*')
                 ->setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
                 ->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    }
}
