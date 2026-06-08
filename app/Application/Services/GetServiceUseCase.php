<?php

namespace App\Application\Services;

use App\Domain\Services\ServiceRepositoryInterface;

final class GetServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(int $id): ?array
    {
        $service = $this->serviceRepository->findById($id);

        return $service?->toArray();
    }
}
