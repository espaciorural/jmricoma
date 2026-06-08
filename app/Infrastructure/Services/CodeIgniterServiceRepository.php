<?php

namespace App\Infrastructure\Services;

use App\Domain\Services\Service;
use App\Domain\Services\ServiceRepositoryInterface;
use App\Models\ServiceModel;

final class CodeIgniterServiceRepository implements ServiceRepositoryInterface
{
    public function __construct(
        private ServiceModel $serviceModel,
        private ServiceMapper $serviceMapper = new ServiceMapper()
    )
    {
    }

    public function findAll(): array
    {
        return array_map(
            fn (array $service): Service => $this->serviceMapper->fromPersistence($service),
            $this->serviceModel->findAll()
        );
    }

    public function findById(int $id): ?Service
    {
        $service = $this->serviceModel->find($id);

        if (! $service) {
            return null;
        }

        return $this->serviceMapper->fromPersistence($service);
    }

    public function create(Service $service): Service
    {
        $data = $this->serviceMapper->toPersistence($service);
        $this->serviceModel->insert($data);

        return $this->serviceMapper->fromPersistence([
            ...$data,
            'id' => $this->serviceModel->insertID(),
        ]);
    }

    public function update(int $id, Service $service): bool
    {
        return (bool) $this->serviceModel->update($id, $this->serviceMapper->toPersistence($service));
    }

    public function delete(int $id): bool
    {
        return (bool) $this->serviceModel->delete($id);
    }
}
