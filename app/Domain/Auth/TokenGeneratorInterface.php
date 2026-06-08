<?php

namespace App\Domain\Auth;

interface TokenGeneratorInterface
{
    public function generateFor(User $user): string;
}
