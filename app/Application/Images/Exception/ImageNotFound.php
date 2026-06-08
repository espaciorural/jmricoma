<?php

namespace App\Application\Images\Exception;

use RuntimeException;

final class ImageNotFound extends RuntimeException
{
    public static function forId(string $id): self
    {
        return new self('No se encontro la imagen con ID: ' . $id);
    }
}
