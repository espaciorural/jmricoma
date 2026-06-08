<?php

namespace App\Infrastructure\Auth;

use App\Domain\Auth\AccessRepositoryInterface;
use App\Domain\Auth\User;
use App\Models\AccessModel;

final class CodeIgniterAccessRepository implements AccessRepositoryInterface
{
    public function __construct(private AccessModel $accessModel)
    {
    }

    public function findByUsername(string $username): ?User
    {
        $user = $this->accessModel->where('username', $username)->first();

        if (! $user) {
            return null;
        }

        return new User(
            (int) $user['id'],
            (string) $user['username'],
            (string) $user['password']
        );
    }
}
