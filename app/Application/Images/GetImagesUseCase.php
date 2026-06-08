<?php

namespace App\Application\Images;

use App\Domain\Images\ImageRepositoryInterface;
use App\Domain\Images\PublicUrlGeneratorInterface;

final class GetImagesUseCase
{
    public function __construct(
        private ImageRepositoryInterface $imageRepository,
        private PublicUrlGeneratorInterface $publicUrlGenerator
    ) {
    }

    public function execute(int $sectionId, string $type): array
    {
        $images = $this->imageRepository->findBySectionAndType($sectionId, $type);

        return array_map(function ($image): array {
            return [
                'id' => $image->id(),
                'path' => $this->publicUrlGenerator->urlFor($image->path()),
            ];
        }, $images);
    }
}
