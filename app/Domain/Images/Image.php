<?php

namespace App\Domain\Images;

use App\Domain\Shared\Exception\InvalidDomainData;

final class Image
{
    public function __construct(
        private ?int $id,
        private string $path,
        private int $sectionId,
        private string $type
    ) {
        $this->path = trim($path);
        $this->type = trim($type);
        $this->assertValid();
    }

    private function assertValid(): void
    {
        if ($this->id !== null && $this->id < 1) {
            throw new InvalidDomainData('Image id must be positive.');
        }

        if ($this->path === '') {
            throw new InvalidDomainData('Image path cannot be empty.');
        }

        if ($this->sectionId < 1) {
            throw new InvalidDomainData('Image section id must be positive.');
        }

        if ($this->type === '') {
            throw new InvalidDomainData('Image type cannot be empty.');
        }
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function sectionId(): int
    {
        return $this->sectionId;
    }

    public function type(): string
    {
        return $this->type;
    }
}
