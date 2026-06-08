<?php

namespace App\Application\Services;

use App\Application\Services\Input\ServiceInput;
use App\Application\Services\Output\ServiceView;
use App\Domain\Services\ServiceRepositoryInterface;

final class CreateServiceUseCase
{
    public function __construct(private ServiceRepositoryInterface $serviceRepository)
    {
    }

    public function execute(ServiceInput $input): ServiceView
    {
        return ServiceView::fromService(
            $this->serviceRepository->create($input->toService())
        );
    }
}
