<?php

namespace App\Domain\Portfolio;

use App\Domain\Shared\Exception\InvalidDomainData;

final class PortfolioItem
{
    public function __construct(
        private ?int $id,
        private string $title,
        private ?string $description,
        private ?string $projectUrl,
        private ?string $skills,
        private int $languageId,
        private int $status,
        private int $item,
        private ?int $mainPortfolioId
    ) {
        $this->title = trim($title);
        $this->projectUrl = $projectUrl !== null ? trim($projectUrl) : null;
        $this->skills = $skills !== null ? trim($skills) : null;
        $this->assertValid();
    }

    private function assertValid(): void
    {
        if ($this->id !== null && $this->id < 1) {
            throw new InvalidDomainData('Portfolio id must be positive.');
        }

        if ($this->title === '') {
            throw new InvalidDomainData('Portfolio title cannot be empty.');
        }

        if ($this->projectUrl === '') {
            $this->projectUrl = null;
        }

        if ($this->skills === '') {
            $this->skills = null;
        }

        if ($this->projectUrl !== null && filter_var($this->projectUrl, FILTER_VALIDATE_URL) === false) {
            throw new InvalidDomainData('Portfolio project URL must be valid.');
        }

        if ($this->skills !== null && mb_strlen($this->skills) > 500) {
            throw new InvalidDomainData('Portfolio skills must not exceed 500 characters.');
        }

        if ($this->languageId < 1) {
            throw new InvalidDomainData('Portfolio language id must be positive.');
        }

        if (! in_array($this->status, [0, 1], true)) {
            throw new InvalidDomainData('Portfolio status must be 0 or 1.');
        }

        if ($this->item < 0) {
            throw new InvalidDomainData('Portfolio item order must not be negative.');
        }

        if ($this->mainPortfolioId !== null && $this->mainPortfolioId < 1) {
            throw new InvalidDomainData('Main portfolio id must be positive.');
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

    public function projectUrl(): ?string
    {
        return $this->projectUrl;
    }

    public function skills(): ?string
    {
        return $this->skills;
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

    public function mainPortfolioId(): ?int
    {
        return $this->mainPortfolioId;
    }
}
