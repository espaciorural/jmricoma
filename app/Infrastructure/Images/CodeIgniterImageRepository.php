<?php

namespace App\Infrastructure\Images;

use App\Domain\Images\Image;
use App\Domain\Images\ImageRepositoryInterface;
use App\Models\ImageModel;

final class CodeIgniterImageRepository implements ImageRepositoryInterface
{
    public function __construct(private ImageModel $imageModel)
    {
    }

    public function findBySectionAndType(int $sectionId, string $type): array
    {
        $images = $this->imageModel
            ->where('id_section', $sectionId)
            ->where('type', $type)
            ->findAll();

        return array_map(
            fn (array $image): Image => Image::fromArray($image),
            $images
        );
    }

    public function findById(int $id): ?Image
    {
        $image = $this->imageModel->find($id);

        if (! $image) {
            return null;
        }

        return Image::fromArray($image);
    }

    public function create(Image $image): Image
    {
        $data = $image->toArray();
        unset($data['id']);

        $this->imageModel->insert($data);

        return Image::fromArray([
            ...$data,
            'id' => $this->imageModel->insertID(),
        ]);
    }

    public function delete(int $id): bool
    {
        return (bool) $this->imageModel->delete($id);
    }
}
