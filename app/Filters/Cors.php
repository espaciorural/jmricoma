<?php namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class Cors implements FilterInterface {
    public function before(RequestInterface $request, $arguments = null)
    {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'OPTIONS') {
            $origin = $request->getHeaderLine('Origin');
            $allowedOrigins = ['http://jmricoma', 'http://localhost:3000'];

            if (in_array($origin, $allowedOrigins)) {
                header("Access-Control-Allow-Origin: $origin");
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
                header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Max-Age: 86400'); // Cache preflight request for 1 day
            }
            // Terminate further execution for OPTIONS requests
            exit(0);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $origin = $request->getHeaderLine('Origin');
        $allowedOrigins = ['http://jmricoma', 'http://localhost:3000'];

        if (in_array($origin, $allowedOrigins) && !$response->hasHeader('Access-Control-Allow-Origin')) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
            $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            $response->setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
            $response->setHeader('Access-Control-Allow-Credentials', 'true');
        }
    }
}
