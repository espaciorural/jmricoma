<?php

namespace App\Application\Images;

use App\Application\Images\Input\UploadImageInput;
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

    public function execute(UploadImageInput $input): array
    {
        $relativePath = $this->imageStorage->store($input->uploadedFile, $input->newFilename);

        if ($input->sectionId !== null) {
            $this->imageRepository->create(new Image(null, $relativePath, $input->sectionId, (string) $input->type));

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
