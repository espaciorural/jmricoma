<?php

use App\Application\Images\CheckImageUseCase;
use App\Application\Images\DeleteImageUseCase;
use App\Application\Images\Exception\ImageDeleteFailed;
use App\Application\Images\Exception\ImageNotFound;
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
            new Image(1, 'uploads/header.webp', 1, 'header'),
        ]);

        $images = (new GetImagesUseCase(
            $repository,
            new PrefixPublicUrlGenerator('https://jmricoma.com/')
        ))->execute(1, 'header');

        $this->assertSame(1, $images[0]->toArray()['id']);
        $this->assertSame('https://jmricoma.com/uploads/header.webp', $images[0]->toArray()['path']);
    }

    public function testItChecksImageByResourceAndId(): void
    {
        $result = (new CheckImageUseCase(
            new FakeImageStorage('uploads/services_34.webp'),
            new PrefixPublicUrlGenerator('https://jmricoma.com/')
        ))->execute('services', '34');

        $this->assertTrue($result->exists);
        $this->assertSame('https://jmricoma.com/uploads/services_34.webp', $result->url);
    }

    public function testItDeletesImageByDatabaseId(): void
    {
        $repository = new InMemoryImageRepository([
            new Image(1, 'uploads/header.webp', 1, 'header'),
        ]);
        $storage = new FakeImageStorage();

        $result = (new DeleteImageUseCase($repository, $storage))->execute('1');

        $this->assertTrue($result->deleted);
        $this->assertSame('uploads/header.webp', $storage->deletedRelativePath);
        $this->assertNull($repository->findById(1));
    }

    public function testItThrowsWhenDeletingMissingImage(): void
    {
        $this->expectException(ImageNotFound::class);
        $this->expectExceptionMessage('No se encontro la imagen con ID: 99');

        (new DeleteImageUseCase(new InMemoryImageRepository(), new FakeImageStorage()))->execute('99');
    }

    public function testItThrowsWhenRepositoryCannotDeleteImage(): void
    {
        $this->expectException(ImageDeleteFailed::class);
        $this->expectExceptionMessage('No se pudo eliminar la imagen con ID: 1');

        $repository = new FailingDeleteImageRepository([
            new Image(1, 'uploads/header.webp', 1, 'header'),
        ]);

        (new DeleteImageUseCase($repository, new FakeImageStorage()))->execute('1');
    }

    public function testItUploadsImageAndStoresMetadataWhenSectionIsProvided(): void
    {
        $repository = new InMemoryImageRepository();
        $storage = new FakeImageStorage();

        $result = (new UploadImageUseCase($storage, $repository))->execute(
            new UploadImageInput('fake-file', 'services_1.webp', 1, 'services')
        );

        $images = $repository->findBySectionAndType(1, 'services');

        $this->assertTrue($result->metadataStored);
        $this->assertSame('uploads/services_1.webp', $images[0]->path());
    }
}

class InMemoryImageRepository implements ImageRepositoryInterface
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
            fn (Image $image): bool => $image->sectionId() === $sectionId
                && $image->type() === $type
        ));
    }

    public function findById(int $id): ?Image
    {
        return $this->images[$id] ?? null;
    }

    public function create(Image $image): Image
    {
        $id = count($this->images) + 1;
        $created = new Image($id, $image->path(), $image->sectionId(), $image->type());
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

final class FailingDeleteImageRepository extends InMemoryImageRepository
{
    public function delete(int $id): bool
    {
        return false;
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
