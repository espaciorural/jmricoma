<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Infrastructure\DependencyInjection\ApplicationServices;
use RuntimeException;

class Auth extends Controller
{
    public function login()
    {
        $request = service('request');

        if ($request->getMethod() !== 'post') {
            return;
        }

        $json = $request->getJSON();
        $username = $json->username ?? '';
        $password = $json->password ?? '';

        try {
            $result = ApplicationServices::loginUserUseCase()->execute($username, $password);
        } catch (RuntimeException $exception) {
            log_message('error', $exception->getMessage());
            return $this->response->setJSON(['error' => 'JWT configuration error.']);
        }

        if (! $result->isSuccess()) {
            return $this->response->setJSON(['success' => false]);
        }

        return $this->response->setJSON([
            'success' => true,
            'token' => $result->token(),
        ]);
    }

    public function options()
    {
        return;
    }
}
