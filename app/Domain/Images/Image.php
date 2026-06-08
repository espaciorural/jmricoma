<?php

namespace App\Domain\Images;

final class Image
{
    public function __construct(
        private ?int $id,
        private string $path,
        private int $sectionId,
        private string $type
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            isset($data['id']) ? (int) $data['id'] : null,
            (string) ($data['path'] ?? ''),
            (int) ($data['id_section'] ?? 0),
            (string) ($data['type'] ?? '')
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'path' => $this->path,
            'id_section' => $this->sectionId,
            'type' => $this->type,
        ];
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function path(): string
    {
        return $this->path;
    }
}
