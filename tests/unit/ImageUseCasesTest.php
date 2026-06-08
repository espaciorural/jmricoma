<?php

use App\Application\Images\CheckImageUseCase;
use App\Application\Images\DeleteImageUseCase;
use App\Application\Images\GetImagesUseCase;
use App\Application\Images\Input\UploadImageInput;
use App\Application\Images\UploadImageUseCase;
use App\Domain\Images\Image;
use App\Domain\Images\ImageRepositoryInterface;
use App\Domain\Images\ImageStorageInterface;
use App\Domain\Images\PublicUrlGeneratorInterface;
use PHPUnit\Framework\TestCase;

final class ImageUseCasesTest extends TestCase
{
    public function testItGetsImagesWithPublicUrls(): void
    {
        $repository = new InMemoryImageRepository([
            Image::fromArray([
                'id' => 1,
                'path' => 'uploads/header.webp',
                'id_section' => 1,
                'type' => 'header',
            ]),
        ]);

        $images = (new GetImagesUseCase(
            $repository,
            new PrefixPublicUrlGenerator('https://jmricoma.com/')
        ))->execute(1, 'header');

        $this->assertSame(1, $images[0]['id']);
        $this->assertSame('https://jmricoma.com/uploads/header.webp', $images[0]['path']);
    }

    public function testItChecksImageByResourceAndId(): void
    {
        $result = (new CheckImageUseCase(
            new FakeImageStorage('uploads/services_34.webp'),
            new PrefixPublicUrlGenerator('https://jmricoma.com/')
        ))->execute('services', '34');

        $this->assertTrue($result['exists']);
        $this->assertSame('https://jmricoma.com/uploads/services_34.webp', $result['url']);
    }

    public function testItDeletesImageByDatabaseId(): void
    {
        $repository = new InMemoryImageRepository([
            Image::fromArray([
                'id' => 1,
                'path' => 'uploads/header.webp',
                'id_section' => 1,
                'type' => 'header',
            ]),
        ]);
        $storage = new FakeImageStorage();

        $result = (new DeleteImageUseCase($repository, $storage))->execute('1');

        $this->assertTrue($result['deleted']);
        $this->assertSame('uploads/header.webp', $storage->deletedRelativePath);
        $this->assertNull($repository->findById(1));
    }

    public function testItUploadsImageAndStoresMetadataWhenSectionIsProvided(): void
    {
        $repository = new InMemoryImageRepository();
        $storage = new FakeImageStorage();

        $result = (new UploadImageUseCase($storage, $repository))->execute(
            new UploadImageInput('fake-file', 'services_1.webp', 1, 'services')
        );

        $images = $repository->findBySectionAndType(1, 'services');

        $this->assertSame('success', $result['status']);
        $this->assertSame('uploads/services_1.webp', $images[0]->path());
    }
}

final class InMemoryImageRepository implements ImageRepositoryInterface
{
    /**
     * @var array<int, Image>
     */
    private array $images = [];

    public function __construct(array $images = [])
    {
        foreach ($images as $image) {
            $this->images[$image->id()] = $image;
        }
    }

    public function findBySectionAndType(int $sectionId, string $type): array
    {
        return array_values(array_filter(
            $this->images,
            fn (Image $image): bool => $image->toArray()['id_section'] === $sectionId
                && $image->toArray()['type'] === $type
        ));
    }

    public function findById(int $id): ?Image
    {
        return $this->images[$id] ?? null;
    }

    public function create(Image $image): Image
    {
        $id = count($this->images) + 1;
        $created = Image::fromArray([
            ...$image->toArray(),
            'id' => $id,
        ]);
        $this->images[$id] = $created;

        return $created;
    }

    public function delete(int $id): bool
    {
        if (! isset($this->images[$id])) {
            return false;
        }

        unset($this->images[$id]);

        return true;
    }
}

final class FakeImageStorage implements ImageStorageInterface
{
    public ?string $deletedRelativePath = null;

    public function __construct(private ?string $foundRelativePath = null)
    {
    }

    public function store($uploadedFile, ?string $preferredFilename = null): string
    {
        return 'uploads/' . ($preferredFilename ?: 'fake.webp');
    }

    public function deleteByRelativePath(string $relativePath): bool
    {
        $this->deletedRelativePath = $relativePath;

        return true;
    }

    public function deleteByBasenamePattern(string $basename): void
    {
    }

    public function findByResourceAndId(string $resource, string $id): ?string
    {
        return $this->foundRelativePath;
    }
}

final class PrefixPublicUrlGenerator implements PublicUrlGeneratorInterface
{
    public function __construct(private string $baseUrl)
    {
    }

    public function urlFor(string $relativePath): string
    {
        return $this->baseUrl . ltrim($relativePath, '/');
    }
}
