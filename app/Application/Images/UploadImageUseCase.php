<?php

namespace App\Application\Images;

use App\Domain\Images\Image;
use App\Domain\Images\ImageRepositoryInterface;
use App\Domain\Images\ImageStorageInterface;

final class UploadImageUseCase
{
    public function __construct(
        private ImageStorageInterface $imageStorage,
        private ImageRepositoryInterface $imageRepository
    ) {
    }

    public function execute($uploadedFile, ?string $newFilename, ?int $sectionId, ?string $type): array
    {
        $relativePath = $this->imageStorage->store($uploadedFile, $newFilename);

        if ($sectionId !== null) {
            $this->imageRepository->create(new Image(null, $relativePath, $sectionId, (string) $type));

            return [
                'status' => 'success',
                'message' => 'Imagen cargada correctamente y datos guardados',
            ];
        }

        return [
            'status' => 'success',
            'message' => 'Imagen cargada correctamente, pero sin datos guardados',
        ];
    }
}
