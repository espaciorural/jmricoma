<?php

namespace App\Infrastructure\Contact;

use App\Domain\Contact\ContactMessage;
use App\Domain\Contact\ContactMessageSenderInterface;
use CodeIgniter\Email\Email;
use RuntimeException;

final class CodeIgniterContactMessageSender implements ContactMessageSenderInterface
{
    public function __construct(
        private Email $email,
        private string $recipientEmail,
        private string $fromEmail,
        private string $fromName,
    ) {
    }

    public function send(ContactMessage $message): void
    {
        $body = implode("\n", [
            'Nou missatge des del formulari de contacte:',
            '',
            'Nom: ' . $message->name(),
            'Email: ' . $message->email(),
            '',
            'Missatge:',
            $message->message(),
        ]);

        $this->email->clear(true);
        $this->email->setFrom($this->fromEmail, $this->fromName);
        $this->email->setTo($this->recipientEmail);
        $this->email->setReplyTo($message->email(), $message->name());
        $this->email->setSubject('Nou contacte des de jmricoma.com');
        $this->email->setMessage($body);

        if (! $this->email->send(false)) {
            throw new RuntimeException('Contact email could not be sent.');
        }
    }
}
