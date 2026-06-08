<?php

namespace App\Application\Images;

use App\Application\Images\Exception\ImageDeleteFailed;
use App\Application\Images\Exception\ImageNotFound;
use App\Application\Images\Output\DeleteImageResult;
use App\Domain\Images\ImageRepositoryInterface;
use App\Domain\Images\ImageStorageInterface;

final class DeleteImageUseCase
{
    public function __construct(
        private ImageRepositoryInterface $imageRepository,
        private ImageStorageInterface $imageStorage
    ) {
    }

    public function execute(string $id): DeleteImageResult
    {
        if (! is_numeric($id)) {
            $this->imageStorage->deleteByBasenamePattern($id);

            return DeleteImageResult::deletedByBasename();
        }

        $numericId = (int) $id;
        $image = $this->imageRepository->findById($numericId);

        if ($image === null) {
            throw ImageNotFound::forId($id);
        }

        $this->imageStorage->deleteByRelativePath($image->path());

        if (! $this->imageRepository->delete($numericId)) {
            throw ImageDeleteFailed::forId($numericId);
        }

        return DeleteImageResult::deletedById($numericId);
    }
}
