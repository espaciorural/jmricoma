<?php

namespace App\Application\Images\Output;

final class UploadImageResult
{
    private function __construct(
        public readonly bool $metadataStored
    ) {
    }

    public static function withMetadata(): self
    {
        return new self(true);
    }

    public static function withoutMetadata(): self
    {
        return new self(false);
    }

    public function toArray(): array
    {
        return [
            'status' => 'success',
            'message' => $this->metadataStored
                ? 'Imagen cargada correctamente y datos guardados'
                : 'Imagen cargada correctamente, pero sin datos guardados',
        ];
    }
}
