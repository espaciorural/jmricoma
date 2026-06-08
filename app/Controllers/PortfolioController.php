<?php

namespace App\Controllers;

use App\Application\Portfolio\Input\PortfolioInput;
use App\Domain\Shared\Exception\InvalidDomainData;
use App\Infrastructure\DependencyInjection\ApplicationServices;
use App\Infrastructure\Http\Requests\PortfolioRequest;
use CodeIgniter\RESTful\ResourceController;

class PortfolioController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $portfolio = array_map(
            fn ($portfolioItem): array => $portfolioItem->toArray(),
            ApplicationServices::listPortfolioUseCase()->execute()
        );

        return $this->respond($portfolio);
    }

    public function show($id = null)
    {
        $portfolioItem = ApplicationServices::getPortfolioUseCase()->execute((int) $id);

        if ($portfolioItem) {
            return $this->respond($portfolioItem->toArray());
        }

        return $this->failNotFound('Portfolio item not found');
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        if (! $this->validate(PortfolioRequest::rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        try {
            $portfolioItem = ApplicationServices::createPortfolioUseCase()->execute(PortfolioInput::fromArray($data));
        } catch (InvalidDomainData $exception) {
            return $this->failValidationErrors($exception->getMessage());
        }

        return $this->respondCreated($portfolioItem->toArray(), 'Portfolio item created');
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (! $this->validate(PortfolioRequest::rules())) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        try {
            $updated = ApplicationServices::updatePortfolioUseCase()->execute((int) $id, PortfolioInput::fromArray($data));
        } catch (InvalidDomainData $exception) {
            return $this->failValidationErrors($exception->getMessage());
        }

        if ($updated) {
            return $this->respond(['status' => 'success', 'message' => 'Portfolio item updated']);
        }

        return $this->fail('Failed to update portfolio item');
    }

    public function delete($id = null)
    {
        if (ApplicationServices::deletePortfolioUseCase()->execute((int) $id)) {
            return $this->respondDeleted('Portfolio item deleted');
        }

        return $this->failNotFound('Portfolio item not found');
    }

    public function optionsHandler($segment = null)
    {
        return;
    }
}
