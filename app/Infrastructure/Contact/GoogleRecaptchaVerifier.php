<?php

namespace App\Infrastructure\Contact;

use App\Domain\Contact\CaptchaVerifierInterface;
use CodeIgniter\HTTP\CURLRequest;
use Throwable;

final class GoogleRecaptchaVerifier implements CaptchaVerifierInterface
{
    public function __construct(
        private CURLRequest $client,
        private bool $enabled,
        private string $secretKey,
        private float $minimumScore,
    ) {
    }

    public function verify(string $token, string $action, ?string $remoteIp = null): bool
    {
        if (! $this->enabled) {
            return true;
        }

        if ($this->secretKey === '' || trim($token) === '') {
            return false;
        }

        try {
            $response = $this->client->post('https://www.google.com/recaptcha/api/siteverify', [
                'form_params' => array_filter([
                    'secret' => $this->secretKey,
                    'response' => $token,
                    'remoteip' => $remoteIp,
                ]),
                'http_errors' => false,
            ]);
        } catch (Throwable) {
            return false;
        }

        $payload = json_decode($response->getBody(), true);

        if (! is_array($payload)) {
            return false;
        }

        return ($payload['success'] ?? false) === true
            && (float) ($payload['score'] ?? 0) >= $this->minimumScore
            && ($payload['action'] ?? '') === $action;
    }
}
