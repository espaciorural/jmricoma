<?php

namespace App\Application\Images\Output;

final class CheckImageResult
{
    private function __construct(
        public readonly bool $exists,
        public readonly ?string $url
    ) {
    }

    public static function missing(): self
    {
        return new self(false, null);
    }

    public static function found(string $url): self
    {
        return new self(true, $url);
    }

    public function toArray(): array
    {
        if (! $this->exists) {
            return ['exists' => false];
        }

        return [
            'exists' => true,
            'url' => $this->url,
        ];
    }
}
