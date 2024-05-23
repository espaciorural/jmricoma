<?php

namespace App\Controllers;

use App\Models\ImageModel;
use CodeIgniter\API\ResponseTrait;

class ImageController extends BaseController
{
    use ResponseTrait;

    public function uploadImage()
    {
        $model = new ImageModel();

        $file = $this->request->getFile('file');
        if ($file->isValid() && !$file->hasMoved()) {
            // Genera un nuevo nombre de archivo para evitar conflictos y conservar la extensión
            $newFilename = $file->getRandomName();
            // Mueve el archivo a la carpeta de almacenamiento final
            $file->move('uploads', $newFilename);

            // 'path' debería ser la ruta donde se almacena el archivo en el servidor
            $data = [
                'path' => 'uploads/' . $newFilename, // Ajusta esta ruta según tus necesidades
                'id_section' => $this->request->getPost('id_section'),
                'type' => $this->request->getPost('type'),
            ];

            if ($model->insert($data)) {
                return $this->response->setJSON(['status' => 'success', 'message' => 'Imagen cargada correctamente']);
            } else {
                return $this->response->setStatusCode(500)->setJSON(['status' => 'error', 'message' => 'No se pudo cargar la imagen']);
            }
        } else {
            // Manejar error de carga
            return $this->response->setStatusCode(400)->setJSON(['status' => 'error', 'message' => 'Archivo inválido o error de carga']);
        }
    }

    public function getImages()
    {
        $sectionId = $this->request->getGet('sectionId');
        $type = $this->request->getGet('type');

        $model = new ImageModel();

        // Buscar en la base de datos todas las imágenes que coincidan con los criterios
        $images = $model->where('id_section', $sectionId)
            ->where('type', $type)
            ->findAll();

        if (!empty($images)) {
            // Transformar las rutas de las imágenes para el frontend si es necesario
            $transformedImages = array_map(function ($img) {
                // Asegúrate de incluir el 'id' de cada imagen en la respuesta
                return [
                    'id' => $img['id'],
                    'path' => "http://jmricoma/" . $img['path']
                ];
            }, $images);

            return $this->respond(['images' => $transformedImages]);
        } else {
            // En lugar de devolver un error 404, devuelve una respuesta exitosa pero indicando que no hay imágenes
            return $this->respond(['images' => [], 'message' => 'No se encontraron imágenes'], 200); // Código 200 para indicar éxito
        }
    }

    public function deleteImage($id)
    {
        $model = new ImageModel();

        // Opcional: Buscar la imagen para obtener la ruta del archivo y eliminar el archivo
        $image = $model->find($id);
        if (!$image) {
            return $this->failNotFound('No se encontró la imagen con ID: ' . $id);
        }

        // Eliminar el archivo de imagen del sistema de archivos
        if (file_exists($image['path'])) {
            unlink($image['path']);
        }

        // Eliminar la entrada de la imagen de la base de datos
        if ($model->delete($id)) {
            return $this->respondDeleted(['message' => 'Imagen eliminada correctamente', 'id' => $id]);
        } else {
            return $this->failServerError('No se pudo eliminar la imagen');
        }
    }
}
