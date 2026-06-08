<?php

namespace App\Application\Portfolio;

use App\Application\Portfolio\Output\PortfolioView;
use App\Domain\Portfolio\PortfolioRepositoryInterface;

final class ListPortfolioUseCase
{
    public function __construct(private PortfolioRepositoryInterface $portfolioRepository)
    {
    }

    public function execute(): array
    {
        return array_map(
            fn ($portfolioItem): PortfolioView => PortfolioView::fromPortfolioItem($portfolioItem),
            $this->portfolioRepository->findAll()
        );
    }
}
