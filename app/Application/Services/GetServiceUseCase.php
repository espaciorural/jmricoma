<?php

namespace App\Application\Services;

use App\Application\Services\Output\ServiceView;
use App\Domain\Services\ServiceRepositoryInterface;

final class GetServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(int $id): ?ServiceView
    {
        $service = $this->serviceRepository->findById($id);

        if ($service === null) {
            return null;
        }

        return ServiceView::fromService($service);
    }
}
