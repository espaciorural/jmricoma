<?php

namespace App\Domain\Auth;

interface PasswordVerifierInterface
{
    public function verify(string $plainPassword, string $passwordHash): bool;
}
