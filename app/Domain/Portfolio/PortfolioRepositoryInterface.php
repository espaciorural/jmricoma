<?php

namespace App\Domain\Portfolio;

interface PortfolioRepositoryInterface
{
    /**
     * @return PortfolioItem[]
     */
    public function findAll(): array;

    public function findById(int $id): ?PortfolioItem;

    public function create(PortfolioItem $portfolioItem): PortfolioItem;

    public function update(int $id, PortfolioItem $portfolioItem): bool;

    public function delete(int $id): bool;
}
