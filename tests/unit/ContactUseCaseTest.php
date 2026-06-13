<?php

use App\Application\Contact\Input\ContactMessageInput;
use App\Application\Contact\SendContactMessageUseCase;
use App\Domain\Contact\CaptchaVerifierInterface;
use App\Domain\Contact\ContactMessage;
use App\Domain\Contact\ContactMessageSenderInterface;
use PHPUnit\Framework\TestCase;

final class ContactUseCaseTest extends TestCase
{
    public function testItSendsContactMessageWhenCaptchaPasses(): void
    {
        $sender = new InMemoryContactMessageSender();
        $useCase = new SendContactMessageUseCase(
            new StaticCaptchaVerifier(true),
            $sender,
            'contact_submit'
        );

        $useCase->execute(ContactMessageInput::fromArray([
            'name' => 'Josep',
            'email' => 'josep@example.com',
            'message' => 'Tinc un projecte.',
            'captchaToken' => 'valid-token',
        ]));

        $this->assertNotNull($sender->lastMessage);
        $this->assertSame('Josep', $sender->lastMessage->name());
        $this->assertSame('josep@example.com', $sender->lastMessage->email());
    }

    public function testItDoesNotSendContactMessageWhenCaptchaFails(): void
    {
        $sender = new InMemoryContactMessageSender();
        $useCase = new SendContactMessageUseCase(
            new StaticCaptchaVerifier(false),
            $sender,
            'contact_submit'
        );

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Captcha validation failed.');

        $useCase->execute(ContactMessageInput::fromArray([
            'name' => 'Josep',
            'email' => 'josep@example.com',
            'message' => 'Tinc un projecte.',
            'captchaToken' => 'invalid-token',
        ]));

        $this->assertNull($sender->lastMessage);
    }
}

final class StaticCaptchaVerifier implements CaptchaVerifierInterface
{
    public function __construct(private bool $valid)
    {
    }

    public function verify(string $token, string $action, ?string $remoteIp = null): bool
    {
        return $this->valid;
    }
}

final class InMemoryContactMessageSender implements ContactMessageSenderInterface
{
    public ?ContactMessage $lastMessage = null;

    public function send(ContactMessage $message): void
    {
        $this->lastMessage = $message;
    }
}
