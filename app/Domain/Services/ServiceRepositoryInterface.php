<?php

namespace App\Domain\Services;

interface ServiceRepositoryInterface
{
    /**
     * @return Service[]
     */
    public function findAll(): array;

    public function findById(int $id): ?Service;

    public function create(Service $service): Service;

    public function update(int $id, Service $service): bool;

    public function delete(int $id): bool;
}
