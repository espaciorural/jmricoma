<?php

use App\Domain\Images\Image;
use App\Domain\Services\Service;
use App\Domain\Shared\Exception\InvalidDomainData;
use PHPUnit\Framework\TestCase;

final class DomainValidationTest extends TestCase
{
    public function testServiceRequiresTitle(): void
    {
        $this->expectException(InvalidDomainData::class);
        $this->expectExceptionMessage('Service title cannot be empty.');

        new Service(null, '   ', null, 1, 1, null);
    }

    public function testServiceRequiresValidStatus(): void
    {
        $this->expectException(InvalidDomainData::class);
        $this->expectExceptionMessage('Service status must be 0 or 1.');

        new Service(null, 'SEO', null, 1, 3, null);
    }

    public function testImageRequiresPath(): void
    {
        $this->expectException(InvalidDomainData::class);
        $this->expectExceptionMessage('Image path cannot be empty.');

        new Image(null, '', 1, 'header');
    }

    public function testImageRequiresType(): void
    {
        $this->expectException(InvalidDomainData::class);
        $this->expectExceptionMessage('Image type cannot be empty.');

        new Image(null, 'uploads/header.webp', 1, ' ');
    }
}
