<?php

namespace App\Infrastructure\Auth;

use App\Domain\Auth\TokenGeneratorInterface;
use App\Domain\Auth\User;
use Firebase\JWT\JWT;
use RuntimeException;

final class JwtTokenGenerator implements TokenGeneratorInterface
{
    public function __construct(
        private ?string $secretKey,
        private int $ttlSeconds = 3600
    ) {
    }

    public function generateFor(User $user): string
    {
        if (empty($this->secretKey)) {
            throw new RuntimeException('JWT Secret Key is not set or is empty.');
        }

        $time = time();

        return JWT::encode([
            'iat' => $time,
            'exp' => $time + $this->ttlSeconds,
            'sub' => $user->id(),
        ], $this->secretKey, 'HS256');
    }
}
