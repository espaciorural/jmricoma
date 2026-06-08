<?php

namespace App\Domain\Images;

interface ImageRepositoryInterface
{
    /**
     * @return Image[]
     */
    public function findBySectionAndType(int $sectionId, string $type): array;

    public function findById(int $id): ?Image;

    public function create(Image $image): Image;

    public function delete(int $id): bool;
}
