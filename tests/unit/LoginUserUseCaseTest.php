<?php

use App\Application\Auth\LoginUserUseCase;
use App\Domain\Auth\AccessRepositoryInterface;
use App\Domain\Auth\PasswordVerifierInterface;
use App\Domain\Auth\TokenGeneratorInterface;
use App\Domain\Auth\User;
use PHPUnit\Framework\TestCase;

final class LoginUserUseCaseTest extends TestCase
{
    public function testItReturnsTokenWhenCredentialsAreValid(): void
    {
        $useCase = new LoginUserUseCase(
            new InMemoryAccessRepository(new User(1, 'admin', 'hashed-password')),
            new FixedPasswordVerifier(true),
            new FixedTokenGenerator('jwt-token')
        );

        $result = $useCase->execute('admin', 'secret');

        $this->assertTrue($result->isSuccess());
        $this->assertSame('jwt-token', $result->token());
    }

    public function testItFailsWhenUserDoesNotExist(): void
    {
        $useCase = new LoginUserUseCase(
            new InMemoryAccessRepository(null),
            new FixedPasswordVerifier(true),
            new FixedTokenGenerator('jwt-token')
        );

        $result = $useCase->execute('missing', 'secret');

        $this->assertFalse($result->isSuccess());
        $this->assertNull($result->token());
    }

    public function testItFailsWhenPasswordIsInvalid(): void
    {
        $useCase = new LoginUserUseCase(
            new InMemoryAccessRepository(new User(1, 'admin', 'hashed-password')),
            new FixedPasswordVerifier(false),
            new FixedTokenGenerator('jwt-token')
        );

        $result = $useCase->execute('admin', 'wrong-password');

        $this->assertFalse($result->isSuccess());
        $this->assertNull($result->token());
    }
}

final class InMemoryAccessRepository implements AccessRepositoryInterface
{
    public function __construct(private ?User $user)
    {
    }

    public function findByUsername(string $username): ?User
    {
        if ($this->user === null || $this->user->username() !== $username) {
            return null;
        }

        return $this->user;
    }
}

final class FixedPasswordVerifier implements PasswordVerifierInterface
{
    public function __construct(private bool $isValid)
    {
    }

    public function verify(string $plainPassword, string $passwordHash): bool
    {
        return $this->isValid;
    }
}

final class FixedTokenGenerator implements TokenGeneratorInterface
{
    public function __construct(private string $token)
    {
    }

    public function generateFor(User $user): string
    {
        return $this->token;
    }
}
