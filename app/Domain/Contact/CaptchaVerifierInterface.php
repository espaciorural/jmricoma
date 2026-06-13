<?php

namespace App\Domain\Contact;

interface CaptchaVerifierInterface
{
    public function verify(string $token, string $action, ?string $remoteIp = null): bool;
}
