<?php

namespace App\Domain\Auth;

interface AccessRepositoryInterface
{
    public function findByUsername(string $username): ?User;
}
