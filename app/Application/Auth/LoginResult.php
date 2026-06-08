<?php

namespace App\Application\Auth;

final class LoginResult
{
    private function __construct(
        private bool $success,
        private ?string $token
    ) {
    }

    public static function success(string $token): self
    {
        return new self(true, $token);
    }

    public static function failure(): self
    {
        return new self(false, null);
    }

    public function isSuccess(): bool
    {
        return $this->success;
    }

    public function token(): ?string
    {
        return $this->token;
    }
}
