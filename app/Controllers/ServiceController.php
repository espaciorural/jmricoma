<?php

namespace App\Controllers;

use App\Application\Services\Input\ServiceInput;
use App\Infrastructure\DependencyInjection\ApplicationServices;
use App\Infrastructure\Http\Requests\ServiceRequest;
use CodeIgniter\RESTful\ResourceController;

class ServiceController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        return $this->respond(
            ApplicationServices::listServicesUseCase()->execute()
        );
    }

    public function show($id = null)
    {
        $data = ApplicationServices::getServiceUseCase()->execute((int) $id);

        if ($data) {
            return $this->respond($data);
        }

        return $this->failNotFound('Service not found');
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->validate(ServiceRequest::rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        return $this->respondCreated(
            ApplicationServices::createServiceUseCase()->execute(ServiceInput::fromArray($data)),
            'Service created'
        );
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (! $this->validate(ServiceRequest::rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        if (ApplicationServices::updateServiceUseCase()->execute((int) $id, ServiceInput::fromArray($data))) {
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
