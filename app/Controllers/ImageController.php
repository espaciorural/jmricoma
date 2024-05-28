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
            if ($this->request->getPost('newFilename')) {
                $newFilename = $this->request->getPost('newFilename');
            } else {
                $newFilename = $file->getRandomName();
            }
            // Mueve el archivo a la carpeta de almacenamiento final
            $file->move('uploads', $newFilename);
    
            // 'path' debería ser la ruta donde se almacena el archivo en el servidor
            $data = [
                'path' => 'uploads/' . $newFilename, // Ajusta esta ruta según tus necesidades
                'id_section' => $this->request->getPost('id_section'),
                'type' => $this->request->getPost('type'),
            ];
    
            // Verifica si el 'id_section' está presente en el POST
            if ($this->request->getPost('id_section')) {
                if ($model->insert($data)) {
                    return $this->response->setJSON(['status' => 'success', 'message' => 'Imagen cargada correctamente y datos guardados']);
                } else {
                    return $this->response->setStatusCode(500)->setJSON(['status' => 'error', 'message' => 'No se pudo cargar la imagen']);
                }
            } else {
                // Solo se sube la imagen, no se inserta en la base de datos
                return $this->response->setJSON(['status' => 'success', 'message' => 'Imagen cargada correctamente, pero sin datos guardados']);
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
        // Verificar si $id es un número
        if (!is_numeric($id)) {
            // Buscar archivos en la carpeta 'uploads' que coincidan con el nombre $id sin importar la extensión
            $path = FCPATH . 'uploads/';
            $files = glob($path . $id . '.*');
            
            // Eliminar todos los archivos encontrados
            foreach ($files as $file) {
                if (file_exists($file)) {
                    unlink($file);
                }
            }
            
            return $this->response->setJSON(['status' => 'success', 'message' => 'Archivos eliminados correctamente']);
        } else {
            $model = new ImageModel();
    
            // Buscar la imagen para obtener la ruta del archivo y eliminar el archivo
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

    public function checkImage($resource,$id)
    {
        $path = FCPATH . 'uploads/';
        $files = glob($path . $resource.'_' . $id . '.*');
        if (!empty($files)) {
            $relativePath = str_replace(FCPATH, '', $files[0]);
            return $this->response->setJSON(['exists' => true, 'url' => base_url($relativePath)]);
        } else {
            return $this->response->setJSON(['exists' => false]);
        }
    }
    

    
}
