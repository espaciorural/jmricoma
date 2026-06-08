<?php

namespace App\Domain\Images;

interface PublicUrlGeneratorInterface
{
    public function urlFor(string $relativePath): string;
}
