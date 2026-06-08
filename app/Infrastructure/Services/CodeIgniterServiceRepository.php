<?php

namespace App\Infrastructure\Services;

use App\Domain\Services\Service;
use App\Domain\Services\ServiceRepositoryInterface;
use App\Models\ServiceModel;

final class CodeIgniterServiceRepository implements ServiceRepositoryInterface
{
    public function __construct(private ServiceModel $serviceModel)
    {
    }

    public function findAll(): array
    {
        return array_map(
            fn (array $service): Service => Service::fromArray($service),
            $this->serviceModel->findAll()
        );
    }

    public function findById(int $id): ?Service
    {
        $service = $this->serviceModel->find($id);

        if (! $service) {
            return null;
        }

        return Service::fromArray($service);
    }

    public function create(Service $service): Service
    {
        $data = $this->withoutNullId($service->toArray());
        $this->serviceModel->insert($data);

        return Service::fromArray([
            ...$data,
            'id' => $this->serviceModel->insertID(),
        ]);
    }

    public function update(int $id, Service $service): bool
    {
        return (bool) $this->serviceModel->update($id, $this->withoutNullId($service->toArray()));
    }

    public function delete(int $id): bool
    {
        return (bool) $this->serviceModel->delete($id);
    }

    private function withoutNullId(array $data): array
    {
        unset($data['id']);

        return $data;
    }
}
