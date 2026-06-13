<?php

namespace App\Application\Contact;

use App\Application\Contact\Input\ContactMessageInput;
use App\Domain\Contact\CaptchaVerifierInterface;
use App\Domain\Contact\ContactMessageSenderInterface;
use RuntimeException;

final class SendContactMessageUseCase
{
    public function __construct(
        private CaptchaVerifierInterface $captchaVerifier,
        private ContactMessageSenderInterface $messageSender,
        private string $captchaAction,
    ) {
    }

    public function execute(ContactMessageInput $input, ?string $remoteIp = null): void
    {
        if (! $this->captchaVerifier->verify($input->captchaToken, $this->captchaAction, $remoteIp)) {
            throw new RuntimeException('Captcha validation failed.');
        }

        $this->messageSender->send($input->toContactMessage());
    }
}
