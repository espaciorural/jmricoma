<?php

namespace App\Application\Services;

use App\Application\Services\Input\ServiceInput;
use App\Domain\Services\ServiceRepositoryInterface;

final class CreateServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(ServiceInput $input): array
    {
        return $this->serviceRepository
            ->create($input->toService())
            ->toArray();
    }
}
