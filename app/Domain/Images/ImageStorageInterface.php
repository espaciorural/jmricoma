<?php

namespace App\Domain\Images;

interface ImageStorageInterface
{
    public function store($uploadedFile, ?string $preferredFilename = null): string;

    public function deleteByRelativePath(string $relativePath): bool;

    public function deleteByBasenamePattern(string $basename): void;

    public function findByResourceAndId(string $resource, string $id): ?string;
}
