<?php

namespace App\Controllers;

use App\Application\Contact\Input\ContactMessageInput;
use App\Domain\Shared\Exception\InvalidDomainData;
use App\Infrastructure\DependencyInjection\ApplicationServices;
use App\Infrastructure\Http\Requests\ContactRequest;
use CodeIgniter\RESTful\ResourceController;
use RuntimeException;

class ContactController extends ResourceController
{
    protected $format = 'json';

    public function send()
    {
        $data = $this->request->getJSON(true) ?? [];

        if (! $this->validate(ContactRequest::rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        try {
            ApplicationServices::sendContactMessageUseCase()->execute(
                ContactMessageInput::fromArray($data),
                $this->request->getIPAddress()
            );
        } catch (InvalidDomainData $exception) {
            return $this->failValidationErrors($exception->getMessage());
        } catch (RuntimeException $exception) {
            return $this->fail($exception->getMessage(), 400);
        }

        return $this->respondCreated([
            'status' => 'success',
            'message' => 'Contact message sent',
        ]);
    }

    public function optionsHandler()
    {
        return;
    }
}
