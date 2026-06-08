<?php

namespace App\Application\Services;

use App\Domain\Services\ServiceRepositoryInterface;

final class ListServicesUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(): array
    {
        return array_map(
            fn ($service): array => $service->toArray(),
            $this->serviceRepository->findAll()
        );
    }
}
