<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class ServiceController extends ResourceController
{
    protected $modelName = 'App\Models\ServiceModel';
    protected $format = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            return $this->respond($data);
        }
        return $this->failNotFound('Service not found');
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        // Validar datos
        if (!$this->validate([
            'title' => 'required|max_length[255]',
            'id_lang' => 'required|is_natural_no_zero',
            'status' => 'required|in_list[0,1]',
            'main_service_id' => 'permit_empty|is_natural_no_zero'
        ])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        if ($this->model->insert($data)) {
            $data['id'] = $this->model->insertID();
            return $this->respondCreated($data, 'Service created');
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        // Validar datos
        if (!$this->validate([
            'title' => 'required|max_length[255]',
            'id_lang' => 'required|is_natural_no_zero',
            'status' => 'required|in_list[0,1]',
            'main_service_id' => 'permit_empty|is_natural_no_zero'
        ])) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        if ($this->model->update($id, $data)) {
            return $this->respond(['status' => 'success', 'message' => 'Service updated']);
        }
        return $this->fail('Failed to update service');
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted('Service deleted');
        }
        return $this->failNotFound('Service not found');
    }

    public function optionsHandler($segment = null)
    {
        // No es necesario hacer nada aquí, el filtro CORS se encargará de los encabezados
    }
}
