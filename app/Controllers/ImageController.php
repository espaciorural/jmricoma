<?php

namespace App\Controllers;

use App\Application\Images\Exception\ImageDeleteFailed;
use App\Application\Images\Exception\ImageNotFound;
use App\Application\Images\Input\UploadImageInput;
use App\Domain\Shared\Exception\InvalidDomainData;
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
        } catch (InvalidDomainData $exception) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Datos de imagen invalidos',
                    'detail' => $exception->getMessage(),
                ]);
        }

        return $this->response->setJSON($result->toArray());
    }

    public function getImages()
    {
        $images = array_map(
            fn ($image): array => $image->toArray(),
            ApplicationServices::getImagesUseCase()->execute(
                (int) $this->request->getGet('sectionId'),
                (string) $this->request->getGet('type')
            )
        );

        if (! empty($images)) {
            return $this->respond(['images' => $images]);
        }

        return $this->respond(['images' => [], 'message' => 'No se encontraron imagenes'], 200);
    }

    public function deleteImage($id)
    {
        try {
            $result = ApplicationServices::deleteImageUseCase()->execute((string) $id);
        } catch (ImageNotFound $exception) {
            return $this->failNotFound($exception->getMessage());
        } catch (ImageDeleteFailed $exception) {
            return $this->failServerError($exception->getMessage());
        }

        if (is_numeric($id)) {
            return $this->respondDeleted($result->payload());
        }

        return $this->response->setJSON($result->payload());
    }

    public function checkImage($resource, $id)
    {
        return $this->response->setJSON(
            ApplicationServices::checkImageUseCase()->execute((string) $resource, (string) $id)->toArray()
        );
    }
}
