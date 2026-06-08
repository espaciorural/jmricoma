<?php

namespace App\Controllers;

use App\Application\Images\Input\UploadImageInput;
use App\Infrastructure\DependencyInjection\ApplicationServices;
use App\Infrastructure\Http\Requests\UploadImageRequest;
use CodeIgniter\API\ResponseTrait;
use RuntimeException;

class ImageController extends BaseController
{
    use ResponseTrait;

    public function uploadImage()
    {
        if (! $this->validate(UploadImageRequest::rules())) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Archivo invalido o error de carga',
                    'errors' => $this->validator->getErrors(),
                ]);
        }

        try {
            $result = ApplicationServices::uploadImageUseCase()->execute(
                new UploadImageInput(
                    $this->request->getFile('file'),
                    $this->request->getPost('newFilename') ?: null,
                    $this->request->getPost('id_section') ? (int) $this->request->getPost('id_section') : null,
                    $this->request->getPost('type')
                )
            );
        } catch (RuntimeException $exception) {
            log_message('error', 'Image upload failed: ' . $exception->getMessage());

            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Archivo invalido o error de carga',
                    'detail' => $exception->getMessage(),
                ]);
        }

        return $this->response->setJSON($result);
    }

    public function getImages()
    {
        $images = ApplicationServices::getImagesUseCase()->execute(
            (int) $this->request->getGet('sectionId'),
            (string) $this->request->getGet('type')
        );

        if (! empty($images)) {
            return $this->respond(['images' => $images]);
        }

        return $this->respond(['images' => [], 'message' => 'No se encontraron imagenes'], 200);
    }

    public function deleteImage($id)
    {
        $result = ApplicationServices::deleteImageUseCase()->execute((string) $id);

        if ($result['notFound']) {
            return $this->failNotFound($result['payload']['message']);
        }

        if ($result['serverError']) {
            return $this->failServerError($result['payload']['message']);
        }

        if (is_numeric($id)) {
            return $this->respondDeleted($result['payload']);
        }

        return $this->response->setJSON($result['payload']);
    }

    public function checkImage($resource, $id)
    {
        return $this->response->setJSON(
            ApplicationServices::checkImageUseCase()->execute((string) $resource, (string) $id)
        );
    }
}
