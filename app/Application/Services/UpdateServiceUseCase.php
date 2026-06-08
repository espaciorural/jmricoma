<?php

namespace App\Application\Services;

use App\Application\Services\Input\ServiceInput;
use App\Domain\Services\ServiceRepositoryInterface;

final class UpdateServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(int $id, ServiceInput $input): bool
    {
        return $this->serviceRepository->update($id, $input->toService());
    }
}
