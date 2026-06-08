<?php

namespace App\Application\Portfolio;

use App\Application\Portfolio\Input\PortfolioInput;
use App\Domain\Portfolio\PortfolioRepositoryInterface;

final class UpdatePortfolioUseCase
{
    public function __construct(private PortfolioRepositoryInterface $portfolioRepository)
    {
    }

    public function execute(int $id, PortfolioInput $input): bool
    {
        return $this->portfolioRepository->update($id, $input->toPortfolioItem());
    }
}
