<?php

namespace App\Application\Portfolio;

use App\Application\Portfolio\Output\PortfolioView;
use App\Domain\Portfolio\PortfolioRepositoryInterface;

final class GetPortfolioUseCase
{
    public function __construct(private PortfolioRepositoryInterface $portfolioRepository)
    {
    }

    public function execute(int $id): ?PortfolioView
    {
        $portfolioItem = $this->portfolioRepository->findById($id);

        if ($portfolioItem === null) {
            return null;
        }

        return PortfolioView::fromPortfolioItem($portfolioItem);
    }
}
