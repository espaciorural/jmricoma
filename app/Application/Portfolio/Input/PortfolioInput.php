<?php

namespace App\Application\Portfolio\Input;

use App\Domain\Portfolio\PortfolioItem;

final class PortfolioInput
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $description,
        public readonly ?string $projectUrl,
        public readonly int $languageId,
        public readonly int $status,
        public readonly ?int $mainPortfolioId
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            trim((string) ($data['title'] ?? '')),
            array_key_exists('description', $data) && $data['description'] !== null
                ? (string) $data['description']
                : null,
            array_key_exists('project_url', $data) && $data['project_url'] !== null
                ? (string) $data['project_url']
                : null,
            (int) ($data['id_lang'] ?? 0),
            (int) ($data['status'] ?? 1),
            isset($data['main_portfolio_id']) && $data['main_portfolio_id'] !== ''
                ? (int) $data['main_portfolio_id']
                : null
        );
    }

    public function toPortfolioItem(): PortfolioItem
    {
        return new PortfolioItem(
            null,
            $this->title,
            $this->description,
            $this->projectUrl,
            $this->languageId,
            $this->status,
            $this->mainPortfolioId
        );
    }
}
