<?php

namespace App\Controllers;

use App\Application\Services\Input\ServiceInput;
use App\Domain\Shared\Exception\InvalidDomainData;
use App\Infrastructure\DependencyInjection\ApplicationServices;
use App\Infrastructure\Http\Requests\ServiceRequest;
use CodeIgniter\RESTful\ResourceController;

class ServiceController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $services = array_map(
            fn ($service): array => $service->toArray(),
            ApplicationServices::listServicesUseCase()->execute()
        );

        return $this->respond($services);
    }

    public function show($id = null)
    {
        $service = ApplicationServices::getServiceUseCase()->execute((int) $id);

        if ($service) {
            return $this->respond($service->toArray());
        }

        return $this->failNotFound('Service not found');
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->validate(ServiceRequest::rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        try {
            $service = ApplicationServices::createServiceUseCase()->execute(ServiceInput::fromArray($data));
        } catch (InvalidDomainData $exception) {
            return $this->failValidationErrors($exception->getMessage());
        }

        return $this->respondCreated($service->toArray(), 'Service created');
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (! $this->validate(ServiceRequest::rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        try {
            $updated = ApplicationServices::updateServiceUseCase()->execute((int) $id, ServiceInput::fromArray($data));
        } catch (InvalidDomainData $exception) {
            return $this->failValidationErrors($exception->getMessage());
        }

        if ($updated) {
            return $this->respond(['status' => 'success', 'message' => 'Service updated']);
        }

        return $this->fail('Failed to update service');
    }

    public function delete($id = null)
    {
        if (ApplicationServices::deleteServiceUseCase()->execute((int) $id)) {
            return $this->respondDeleted('Service deleted');
        }

        return $this->failNotFound('Service not found');
    }

    public function optionsHandler($segment = null)
    {
        return;
    }

}
