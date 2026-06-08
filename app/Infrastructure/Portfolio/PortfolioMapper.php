<?php

namespace App\Infrastructure\Portfolio;

use App\Domain\Portfolio\PortfolioItem;

final class PortfolioMapper
{
    public function fromPersistence(array $data): PortfolioItem
    {
        return new PortfolioItem(
            isset($data['id']) ? (int) $data['id'] : null,
            (string) ($data['title'] ?? ''),
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

    public function toPersistence(PortfolioItem $portfolioItem): array
    {
        return [
            'title' => $portfolioItem->title(),
            'description' => $portfolioItem->description(),
            'project_url' => $portfolioItem->projectUrl(),
            'id_lang' => $portfolioItem->languageId(),
            'status' => $portfolioItem->status(),
            'main_portfolio_id' => $portfolioItem->mainPortfolioId(),
        ];
    }
}
