<?php

namespace App\Infrastructure\Services;

use App\Domain\Services\Service;

final class ServiceMapper
{
    public function fromPersistence(array $data): Service
    {
        return new Service(
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

    public function toPersistence(Service $service): array
    {
        return [
            'title' => $service->title(),
            'description' => $service->description(),
            'id_lang' => $service->languageId(),
            'status' => $service->status(),
            'main_service_id' => $service->mainServiceId(),
        ];
    }
}
