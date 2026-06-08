<?php

use App\Application\Services\CreateServiceUseCase;
use App\Application\Services\DeleteServiceUseCase;
use App\Application\Services\GetServiceUseCase;
use App\Application\Services\Input\ServiceInput;
use App\Application\Services\ListServicesUseCase;
use App\Application\Services\UpdateServiceUseCase;
use App\Domain\Services\Service;
use App\Domain\Services\ServiceRepositoryInterface;
use PHPUnit\Framework\TestCase;

final class ServiceUseCasesTest extends TestCase
{
    public function testItListsServices(): void
    {
        $repository = new InMemoryServiceRepository([
            new Service(1, 'Web development', 'Custom websites', 1, 1, null),
        ]);

        $services = (new ListServicesUseCase($repository))->execute();

        $this->assertSame('Web development', $services[0]->toArray()['title']);
        $this->assertSame(1, $services[0]->toArray()['id_lang']);
    }

    public function testItGetsServiceById(): void
    {
        $repository = new InMemoryServiceRepository([
            new Service(2, 'SEO', null, 1, 1, null),
        ]);

        $service = (new GetServiceUseCase($repository))->execute(2);

        $this->assertSame('SEO', $service->toArray()['title']);
    }

    public function testItCreatesService(): void
    {
        $repository = new InMemoryServiceRepository();

        $service = (new CreateServiceUseCase($repository))->execute(ServiceInput::fromArray([
            'title' => 'Maintenance',
            'description' => 'Monthly support',
            'id_lang' => 1,
            'status' => 1,
            'main_service_id' => null,
        ]));

        $this->assertSame(1, $service->toArray()['id']);
        $this->assertSame('Maintenance', $service->toArray()['title']);
    }

    public function testItUpdatesService(): void
    {
        $repository = new InMemoryServiceRepository([
            new Service(1, 'Old title', null, 1, 1, null),
        ]);

        $updated = (new UpdateServiceUseCase($repository))->execute(1, ServiceInput::fromArray([
            'title' => 'New title',
            'description' => null,
            'id_lang' => 1,
            'status' => 1,
            'main_service_id' => null,
        ]));

        $service = (new GetServiceUseCase($repository))->execute(1);

        $this->assertTrue($updated);
        $this->assertSame('New title', $service->toArray()['title']);
    }

    public function testItDeletesService(): void
    {
        $repository = new InMemoryServiceRepository([
            new Service(1, 'To delete', null, 1, 1, null),
        ]);

        $deleted = (new DeleteServiceUseCase($repository))->execute(1);

        $this->assertTrue($deleted);
        $this->assertNull((new GetServiceUseCase($repository))->execute(1));
    }
}

final class InMemoryServiceRepository implements ServiceRepositoryInterface
{
    /**
     * @var array<int, Service>
     */
    private array $services = [];

    public function __construct(array $services = [])
    {
        foreach ($services as $service) {
            $this->services[$service->id()] = $service;
        }
    }

    public function findAll(): array
    {
        return array_values($this->services);
    }

    public function findById(int $id): ?Service
    {
        return $this->services[$id] ?? null;
    }

    public function create(Service $service): Service
    {
        $id = count($this->services) + 1;
        $created = new Service(
            $id,
            $service->title(),
            $service->description(),
            $service->languageId(),
            $service->status(),
            $service->mainServiceId()
        );
        $this->services[$id] = $created;

        return $created;
    }

    public function update(int $id, Service $service): bool
    {
        if (! isset($this->services[$id])) {
            return false;
        }

        $this->services[$id] = new Service(
            $id,
            $service->title(),
            $service->description(),
            $service->languageId(),
            $service->status(),
            $service->mainServiceId()
        );

        return true;
    }

    public function delete(int $id): bool
    {
        if (! isset($this->services[$id])) {
            return false;
        }

        unset($this->services[$id]);

        return true;
    }
}
