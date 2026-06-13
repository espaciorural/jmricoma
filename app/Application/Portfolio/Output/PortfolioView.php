<?php

namespace App\Application\Portfolio\Output;

use App\Domain\Portfolio\PortfolioItem;

final class PortfolioView
{
    public function __construct(private array $data)
    {
    }

    public static function fromPortfolioItem(PortfolioItem $portfolioItem): self
    {
        return new self([
            'id' => $portfolioItem->id(),
            'title' => $portfolioItem->title(),
            'description' => $portfolioItem->description(),
            'project_url' => $portfolioItem->projectUrl(),
            'skills' => $portfolioItem->skills(),
            'id_lang' => $portfolioItem->languageId(),
            'status' => $portfolioItem->status(),
            'item' => $portfolioItem->item(),
            'main_portfolio_id' => $portfolioItem->mainPortfolioId(),
        ]);
    }

    public function toArray(): array
    {
        return $this->data;
    }
}
