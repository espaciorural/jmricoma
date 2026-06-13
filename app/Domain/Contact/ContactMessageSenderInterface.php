<?php

namespace App\Domain\Contact;

interface ContactMessageSenderInterface
{
    public function send(ContactMessage $message): void;
}
