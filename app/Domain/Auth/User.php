<?php

namespace App\Domain\Auth;

final class User
{
    public function __construct(
        private int $id,
        private string $username,
        private string $passwordHash
    ) {
    }

    public function id(): int
    {
        return $this->id;
    }

    public function username(): string
    {
        return $this->username;
    }

    public function passwordHash(): string
    {
        return $this->passwordHash;
    }
}
