<?php

namespace App\Application\Services\Input;

use App\Domain\Services\Service;

final class ServiceInput
{
    public function __construct(
        public readonly string $title,
        public readonly ?string $description,
        public readonly int $languageId,
        public readonly int $status,
        public readonly int $item,
        public readonly ?int $mainServiceId
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            trim((string) ($data['title'] ?? '')),
            array_key_exists('description', $data) && $data['description'] !== null
                ? (string) $data['description']
                : null,
            (int) ($data['id_lang'] ?? 0),
            (int) ($data['status'] ?? 1),
            (int) ($data['item'] ?? 0),
            isset($data['main_service_id']) && $data['main_service_id'] !== ''
                ? (int) $data['main_service_id']
                : null
        );
    }

    public function toService(): Service
    {
        return new Service(
            null,
            $this->title,
            $this->description,
            $this->languageId,
            $this->status,
            $this->item,
            $this->mainServiceId
        );
    }
}
