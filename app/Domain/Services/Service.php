<?php

namespace App\Domain\Services;

final class Service
{
    public function __construct(
        private ?int $id,
        private string $title,
        private ?string $description,
        private int $languageId,
        private int $status,
        private ?int $mainServiceId
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            isset($data['id']) ? (int) $data['id'] : null,
            (string) ($data['title'] ?? ''),
            array_key_exists('description', $data) && $data['description'] !== null
                ? (string) $data['description']
                : null,
            (int) ($data['id_lang'] ?? 0),
            (int) ($data['status'] ?? 1),
            isset($data['main_service_id']) && $data['main_service_id'] !== ''
                ? (int) $data['main_service_id']
                : null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'id_lang' => $this->languageId,
            'status' => $this->status,
            'main_service_id' => $this->mainServiceId,
        ];
    }

    public function id(): ?int
    {
        return $this->id;
    }
}
