<?php

namespace App\Application\Services;

use App\Domain\Services\Service;
use App\Domain\Services\ServiceRepositoryInterface;

final class UpdateServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(int $id, array $data): bool
    {
        return $this->serviceRepository->update($id, Service::fromArray($data));
    }
}
