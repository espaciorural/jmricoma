<?php

namespace App\Infrastructure\Images;

use App\Domain\Images\PublicUrlGeneratorInterface;

final class CodeIgniterPublicUrlGenerator implements PublicUrlGeneratorInterface
{
    public function urlFor(string $relativePath): string
    {
        return base_url($relativePath);
    }
}
