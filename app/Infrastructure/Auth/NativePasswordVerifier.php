<?php

namespace App\Infrastructure\Auth;

use App\Domain\Auth\PasswordVerifierInterface;

final class NativePasswordVerifier implements PasswordVerifierInterface
{
    public function verify(string $plainPassword, string $passwordHash): bool
    {
        return password_verify($plainPassword, $passwordHash);
    }
}
