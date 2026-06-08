<?php

namespace App\Infrastructure\Images;

use App\Domain\Images\ImageStorageInterface;
use RuntimeException;

final class LocalPublicImageStorage implements ImageStorageInterface
{
    public function __construct(private string $uploadsDirectory)
    {
    }

    public function store($uploadedFile, ?string $preferredFilename = null): string
    {
        if ($uploadedFile === null) {
            throw new RuntimeException('No file was received.');
        }

        if (! $uploadedFile->isValid() || $uploadedFile->hasMoved()) {
            throw new RuntimeException($uploadedFile->getErrorString() ?: 'Invalid file or upload error.');
        }

        $filename = $preferredFilename ?: $uploadedFile->getRandomName();
        $uploadedFile->move($this->uploadsDirectory, $filename);

        return 'uploads/' . $filename;
    }

    public function deleteByRelativePath(string $relativePath): bool
    {
        $absolutePath = FCPATH . ltrim($relativePath, '/\\');

        if (! file_exists($absolutePath)) {
            return false;
        }

        return unlink($absolutePath);
    }

    public function deleteByBasenamePattern(string $basename): void
    {
        foreach (glob($this->uploadsDirectory . $basename . '.*') as $file) {
            if (file_exists($file)) {
                unlink($file);
            }
        }
    }

    public function findByResourceAndId(string $resource, string $id): ?string
    {
        $files = glob($this->uploadsDirectory . $resource . '_' . $id . '.*');

        if (empty($files)) {
            return null;
        }

        return str_replace(FCPATH, '', $files[0]);
    }
}
