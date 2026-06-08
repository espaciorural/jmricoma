<?php

namespace App\Application\Images;

use App\Domain\Images\ImageRepositoryInterface;
use App\Domain\Images\ImageStorageInterface;

final class DeleteImageUseCase
{
    public function __construct(
        private ImageRepositoryInterface $imageRepository,
        private ImageStorageInterface $imageStorage
    ) {
    }

    public function execute(string $id): array
    {
        if (! is_numeric($id)) {
            $this->imageStorage->deleteByBasenamePattern($id);

            return [
                'deleted' => true,
                'payload' => ['status' => 'success', 'message' => 'Archivos eliminados correctamente'],
                'notFound' => false,
                'serverError' => false,
            ];
        }

        $numericId = (int) $id;
        $image = $this->imageRepository->findById($numericId);

        if ($image === null) {
            return [
                'deleted' => false,
                'payload' => ['message' => 'No se encontro la imagen con ID: ' . $id],
                'notFound' => true,
                'serverError' => false,
            ];
        }

        $this->imageStorage->deleteByRelativePath($image->path());

        if (! $this->imageRepository->delete($numericId)) {
            return [
                'deleted' => false,
                'payload' => ['message' => 'No se pudo eliminar la imagen'],
                'notFound' => false,
                'serverError' => true,
            ];
        }

        return [
            'deleted' => true,
            'payload' => ['message' => 'Imagen eliminada correctamente', 'id' => $numericId],
            'notFound' => false,
            'serverError' => false,
        ];
    }
}
