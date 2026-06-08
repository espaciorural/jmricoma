<?php

namespace App\Application\Auth;

use App\Domain\Auth\AccessRepositoryInterface;
use App\Domain\Auth\PasswordVerifierInterface;
use App\Domain\Auth\TokenGeneratorInterface;

final class LoginUserUseCase
{
    public function __construct(
        private AccessRepositoryInterface $accessRepository,
        private PasswordVerifierInterface $passwordVerifier,
        private TokenGeneratorInterface $tokenGenerator
    ) {
    }

    public function execute(string $username, string $password): LoginResult
    {
        $user = $this->accessRepository->findByUsername($username);

        if ($user === null) {
            return LoginResult::failure();
        }

        if (! $this->passwordVerifier->verify($password, $user->passwordHash())) {
            return LoginResult::failure();
        }

        return LoginResult::success($this->tokenGenerator->generateFor($user));
    }
}
