<?php

namespace App\Application\Images\Exception;

use RuntimeException;

final class ImageDeleteFailed extends RuntimeException
{
    public static function forId(int $id): self
    {
        return new self('No se pudo eliminar la imagen con ID: ' . $id);
    }
}
