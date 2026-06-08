<?php

namespace App\Controllers;

use App\Infrastructure\DependencyInjection\ApplicationServices;
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

        if (! $this->isValidServicePayload()) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        return $this->respondCreated(
            ApplicationServices::createServiceUseCase()->execute($data),
            'Service created'
        );
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (! $this->isValidServicePayload()) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        if (ApplicationServices::updateServiceUseCase()->execute((int) $id, $data)) {
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

    private function isValidServicePayload(): bool
    {
        return $this->validate([
            'title' => 'required|max_length[255]',
            'id_lang' => 'required|is_natural_no_zero',
            'status' => 'required|in_list[0,1]',
            'main_service_id' => 'permit_empty|is_natural_no_zero',
        ]);
    }
}
