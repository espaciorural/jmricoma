<?php

namespace App\Application\Images;

use App\Application\Images\Output\CheckImageResult;
use App\Domain\Images\ImageStorageInterface;
use App\Domain\Images\PublicUrlGeneratorInterface;

final class CheckImageUseCase
{
    public function __construct(
        private ImageStorageInterface $imageStorage,
        private PublicUrlGeneratorInterface $publicUrlGenerator
    ) {
    }

    public function execute(string $resource, string $id): CheckImageResult
    {
        $relativePath = $this->imageStorage->findByResourceAndId($resource, $id);

        if ($relativePath === null) {
            return CheckImageResult::missing();
        }

        return CheckImageResult::found($this->publicUrlGenerator->urlFor($relativePath));
    }
}
