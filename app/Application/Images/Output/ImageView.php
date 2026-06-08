<?php

namespace App\Application\Images\Output;

final class ImageView
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $url
    ) {
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'path' => $this->url,
        ];
    }
}
