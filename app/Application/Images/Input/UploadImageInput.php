<?php

namespace App\Application\Images\Input;

final class UploadImageInput
{
    public function __construct(
        public readonly mixed $uploadedFile,
        public readonly ?string $newFilename,
        public readonly ?int $sectionId,
        public readonly ?string $type
    ) {
    }
}
