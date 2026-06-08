<?php

namespace App\Infrastructure\Portfolio;

use App\Domain\Portfolio\PortfolioItem;
use App\Domain\Portfolio\PortfolioRepositoryInterface;
use App\Models\PortfolioModel;

final class CodeIgniterPortfolioRepository implements PortfolioRepositoryInterface
{
    public function __construct(
        private PortfolioModel $portfolioModel,
        private PortfolioMapper $portfolioMapper = new PortfolioMapper()
    ) {
    }

    public function findAll(): array
    {
        return array_map(
            fn (array $portfolioItem): PortfolioItem => $this->portfolioMapper->fromPersistence($portfolioItem),
            $this->portfolioModel->findAll()
        );
    }

    public function findById(int $id): ?PortfolioItem
    {
        $portfolioItem = $this->portfolioModel->find($id);

        if (! $portfolioItem) {
            return null;
        }

        return $this->portfolioMapper->fromPersistence($portfolioItem);
    }

    public function create(PortfolioItem $portfolioItem): PortfolioItem
    {
        $data = $this->portfolioMapper->toPersistence($portfolioItem);
        $this->portfolioModel->insert($data);

        return $this->portfolioMapper->fromPersistence([
            ...$data,
            'id' => $this->portfolioModel->insertID(),
        ]);
    }

    public function update(int $id, PortfolioItem $portfolioItem): bool
    {
        return (bool) $this->portfolioModel->update($id, $this->portfolioMapper->toPersistence($portfolioItem));
    }

    public function delete(int $id): bool
    {
        return (bool) $this->portfolioModel->delete($id);
    }
}
