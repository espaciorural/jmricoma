<?php

namespace App\Application\Portfolio;

use App\Domain\Images\ImageRepositoryInterface;
use App\Domain\Images\ImageStorageInterface;
use App\Domain\Portfolio\PortfolioRepositoryInterface;

final class DeletePortfolioUseCase
{
    public function __construct(
        private PortfolioRepositoryInterface $portfolioRepository,
        private ImageRepositoryInterface $imageRepository,
        private ImageStorageInterface $imageStorage
    ) {
    }

    public function execute(int $id): bool
    {
        foreach ($this->imageRepository->findBySectionAndType($id, 'portfolio_gallery') as $image) {
            $this->imageStorage->deleteByRelativePath($image->path());

            if ($image->id() !== null) {
                $this->imageRepository->delete($image->id());
            }
        }

        return $this->portfolioRepository->delete($id);
    }
}
