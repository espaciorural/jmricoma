<?php

namespace App\Application\Services;

use App\Domain\Services\ServiceRepositoryInterface;

final class DeleteServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(int $id): bool
    {
        return $this->serviceRepository->delete($id);
    }
}
