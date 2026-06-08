<?php

namespace App\Application\Services\Output;

use App\Domain\Services\Service;

final class ServiceView
{
    public function __construct(private array $data)
    {
    }

    public static function fromService(Service $service): self
    {
        return new self([
            'id' => $service->id(),
            'title' => $service->title(),
            'description' => $service->description(),
            'id_lang' => $service->languageId(),
            'status' => $service->status(),
            'main_service_id' => $service->mainServiceId(),
        ]);
    }

    public function toArray(): array
    {
        return $this->data;
    }
}
