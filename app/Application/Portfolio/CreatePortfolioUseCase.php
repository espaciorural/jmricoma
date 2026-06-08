<?php

namespace App\Application\Portfolio;

use App\Application\Portfolio\Input\PortfolioInput;
use App\Application\Portfolio\Output\PortfolioView;
use App\Domain\Portfolio\PortfolioRepositoryInterface;

final class CreatePortfolioUseCase
{
    public function __construct(private PortfolioRepositoryInterface $portfolioRepository)
    {
    }

    public function execute(PortfolioInput $input): PortfolioView
    {
        return PortfolioView::fromPortfolioItem(
            $this->portfolioRepository->create($input->toPortfolioItem())
        );
    }
}
