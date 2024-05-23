<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class LiteralController extends ResourceController
{
    protected $modelName = 'App\Models\LiteralModel';
    protected $format    = 'json';

    public function get()
    {
        // Retorna todos los literales o puedes implementar lógica para filtrar por sección o idioma
        return $this->respond($this->model->findAll());
    }

    public function getBySection($sectionId = null)
    {
        if (!$sectionId) {
            return $this->failNotFound('Sección no especificada');
        }

        $literals = $this->model->where('id_section', $sectionId)->findAll();

        if ($literals) {
            return $this->respond($literals);
        } else {
            return $this->failNotFound('No se encontraron literales para la sección especificada');
        }
    }

    public function create()
    {
        // Lógica para crear un nuevo literal
        $data = [
            'lang' => $this->request->getPost('lang'),
            'id_section' => $this->request->getPost('id_section'),
            'type' => $this->request->getPost('type'),
            'text' => $this->request->getPost('text'),
        ];

        $id = $this->model->insert($data);

        if ($id) {
            $data['id'] = $id;
            return $this->respondCreated($data);
        } else {
            return $this->failServerError();
        }
    }

    // Método para actualizar un literal
    public function update($id = null)
    {
        $data = $this->request->getJSON(true); // Asegúrate de obtener los datos como array

        // Intenta encontrar el registro por ID
        $existingItem = $this->model->find($id);

        if ($existingItem) {
            // Si el registro existe, actualízalo
            $success = $this->model->update($id, $data);
        } else {
            // Si el registro no existe, crea uno nuevo
            // Asegúrate de quitar el ID del data si es null o no deseas pasarlo
            unset($data['id']); // Remueve el ID si está presente y no deseas usarlo
            $success = $this->model->insert($data);
            $id = $this->model->getInsertID(); // Obtén el ID del nuevo registro
        }

        if ($success) {
            // Si se creó o actualizó correctamente, devuelve el registro con su ID
            // Esto es útil especialmente si se creó un nuevo registro
            $data['id'] = $id;
            return $this->respondUpdated($data); // Considera si respondCreated es más apropiado en caso de inserción
        } else {
            return $this->failNotFound('No fue posible actualizar o crear el registro');
        }
    }

    public function updateBySection($id_section = null)
    {
        $data = $this->request->getJSON(true); // Asumiendo que esto es un arreglo de literales.

        if (!$id_section) {
            return $this->failValidationErrors('Se requiere el ID de la sección.');
        }

        if (!is_array($data)) {
            return $this->failValidationErrors('Los datos enviados deben ser un arreglo.');
        }

        $responses = [];

        // Verifica si hay un ID para decidir si actualizar o insertar
        if (isset($data['id']) && !empty($data['id'])) {
            // Actualiza el literal existente
            try {
                $result = $this->model->update($data['id'], [
                    'text' => $data['text'],
                ]);
                if (!$result) {
                    log_message('error', "Fallo al actualizar el literal con ID: {$data['id']}");
                } else {
                    $responses[] = ['id' => $data['id'], 'action' => 'updated'];
                }
            } catch (\Exception $e) {
                log_message('error', "Excepción al actualizar el literal con ID: {$data['id']}. Error: " . $e->getMessage());
            }
        } else {
            // Inserta un nuevo literal ya que no hay ID
            try {
                $newData = [
                    'lang' => $data['lang'],
                    'id_section' => $id_section,
                    'type' => $data['type'],
                    'text' => $data['text'],
                    // Añade más campos aquí según sea necesario
                ];
                $inserted = $this->model->insert($newData);
                if ($inserted) {
                    $newId = $this->model->getInsertID();
                    $responses[] = ['id' => $newId, 'lang' => $data['lang'], 'type' => $data['type'], 'action' => 'created'];
                }
            } catch (\Exception $e) {
                log_message('error', "Excepción al insertar un nuevo literal. Error: " . $e->getMessage());
            }
        }

        return $this->respondUpdated(['message' => 'Operación completada.', 'data' => $responses]);

    }


    // Método para eliminar un literal
    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['id' => $id, 'message' => 'Literal eliminado']);
        } else {
            return $this->failNotFound('Literal no encontrado con id ' . $id);
        }
    }

    public function optionsHandler($segment = null)
    {
        // No es necesario hacer nada aquí, el filtro CORS se encargará de los encabezados
    }
}
