<?php

namespace App\Domain\Services;

use App\Domain\Shared\Exception\InvalidDomainData;

final class Service
{
    public function __construct(
        private ?int $id,
        private string $title,
        private ?string $description,
        private int $languageId,
        private int $status,
        private int $item,
        private ?int $mainServiceId
    ) {
        $this->title = trim($title);
        $this->assertValid();
    }

    private function assertValid(): void
    {
        if ($this->id !== null && $this->id < 1) {
            throw new InvalidDomainData('Service id must be positive.');
        }

        if ($this->title === '') {
            throw new InvalidDomainData('Service title cannot be empty.');
        }

        if ($this->languageId < 1) {
            throw new InvalidDomainData('Service language id must be positive.');
        }

        if (! in_array($this->status, [0, 1], true)) {
            throw new InvalidDomainData('Service status must be 0 or 1.');
        }

        if ($this->item < 0) {
            throw new InvalidDomainData('Service item order must not be negative.');
        }

        if ($this->mainServiceId !== null && $this->mainServiceId < 1) {
            throw new InvalidDomainData('Main service id must be positive.');
        }
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function description(): ?string
    {
        return $this->description;
    }

    public function languageId(): int
    {
        return $this->languageId;
    }

    public function status(): int
    {
        return $this->status;
    }

    public function item(): int
    {
        return $this->item;
    }

    public function mainServiceId(): ?int
    {
        return $this->mainServiceId;
    }
}
