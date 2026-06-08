<?php

namespace App\Controllers;

use App\Application\Auth\LoginUserUseCase;
use App\Infrastructure\Auth\CodeIgniterAccessRepository;
use App\Infrastructure\Auth\JwtTokenGenerator;
use App\Infrastructure\Auth\NativePasswordVerifier;
use App\Models\AccessModel;
use CodeIgniter\Controller;
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
            $result = $this->loginUserUseCase()->execute($username, $password);
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

    private function loginUserUseCase(): LoginUserUseCase
    {
        return new LoginUserUseCase(
            new CodeIgniterAccessRepository(new AccessModel()),
            new NativePasswordVerifier(),
            new JwtTokenGenerator(env('JWT_SECRET_KEY'))
        );
    }
}
