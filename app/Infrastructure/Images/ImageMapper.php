<?php

namespace App\Infrastructure\Images;

use App\Domain\Images\Image;

final class ImageMapper
{
    public function fromPersistence(array $data): Image
    {
        return new Image(
            isset($data['id']) ? (int) $data['id'] : null,
            (string) ($data['path'] ?? ''),
            (int) ($data['id_section'] ?? 0),
            (string) ($data['type'] ?? '')
        );
    }

    public function toPersistence(Image $image): array
    {
        return [
            'path' => $image->path(),
            'id_section' => $image->sectionId(),
            'type' => $image->type(),
        ];
    }
}
