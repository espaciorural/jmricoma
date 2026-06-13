<?php

namespace App\Domain\Contact;

use App\Domain\Shared\Exception\InvalidDomainData;

final class ContactMessage
{
    public function __construct(
        private string $name,
        private string $email,
        private string $message,
    ) {
        $this->name = trim($this->name);
        $this->email = trim($this->email);
        $this->message = trim($this->message);

        if ($this->name === '') {
            throw new InvalidDomainData('Contact name cannot be empty.');
        }

        if (! filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidDomainData('Contact email is invalid.');
        }

        if ($this->message === '') {
            throw new InvalidDomainData('Contact message cannot be empty.');
        }
    }

    public function name(): string
    {
        return $this->name;
    }

    public function email(): string
    {
        return $this->email;
    }

    public function message(): string
    {
        return $this->message;
    }
}
