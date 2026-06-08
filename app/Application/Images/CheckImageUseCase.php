<?php

namespace App\Application\Images;

use App\Domain\Images\ImageStorageInterface;
use App\Domain\Images\PublicUrlGeneratorInterface;

final class CheckImageUseCase
{
    public function __construct(
        private ImageStorageInterface $imageStorage,
        private PublicUrlGeneratorInterface $publicUrlGenerator
    ) {
    }

    public function execute(string $resource, string $id): array
    {
        $relativePath = $this->imageStorage->findByResourceAndId($resource, $id);

        if ($relativePath === null) {
            return ['exists' => false];
        }

        return [
            'exists' => true,
            'url' => $this->publicUrlGenerator->urlFor($relativePath),
        ];
    }
}
