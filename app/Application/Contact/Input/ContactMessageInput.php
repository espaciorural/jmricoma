<?php

namespace App\Application\Contact\Input;

use App\Domain\Contact\ContactMessage;

final class ContactMessageInput
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $message,
        public readonly string $captchaToken,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            (string) ($data['name'] ?? ''),
            (string) ($data['email'] ?? ''),
            (string) ($data['message'] ?? ''),
            (string) ($data['captchaToken'] ?? '')
        );
    }

    public function toContactMessage(): ContactMessage
    {
        return new ContactMessage($this->name, $this->email, $this->message);
    }
}
