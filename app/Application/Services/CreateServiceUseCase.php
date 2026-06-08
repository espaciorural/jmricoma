<?php

namespace App\Application\Services;

use App\Domain\Services\Service;
use App\Domain\Services\ServiceRepositoryInterface;

final class CreateServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(array $data): array
    {
        return $this->serviceRepository
            ->create(Service::fromArray($data))
            ->toArray();
    }
}
