<?php

namespace App\Application\Images\Output;

final class DeleteImageResult
{
    private function __construct(
        public readonly bool $deleted,
        public readonly ?int $id,
        public readonly ?string $message
    ) {
    }

    public static function deletedByBasename(): self
    {
        return new self(true, null, 'Archivos eliminados correctamente');
    }

    public static function deletedById(int $id): self
    {
        return new self(true, $id, 'Imagen eliminada correctamente');
    }

    public function payload(): array
    {
        $payload = ['message' => $this->message];

        if ($this->id !== null) {
            $payload['id'] = $this->id;
        }

        if ($this->deleted && $this->id === null) {
            $payload['status'] = 'success';
        }

        return $payload;
    }
}
