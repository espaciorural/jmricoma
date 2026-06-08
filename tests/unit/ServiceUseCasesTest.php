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
            Service::fromArray([
                'id' => 1,
                'title' => 'Web development',
                'description' => 'Custom websites',
                'id_lang' => 1,
                'status' => 1,
                'main_service_id' => null,
            ]),
        ]);

        $services = (new ListServicesUseCase($repository))->execute();

        $this->assertSame('Web development', $services[0]['title']);
        $this->assertSame(1, $services[0]['id_lang']);
    }

    public function testItGetsServiceById(): void
    {
        $repository = new InMemoryServiceRepository([
            Service::fromArray([
                'id' => 2,
                'title' => 'SEO',
                'description' => null,
                'id_lang' => 1,
                'status' => 1,
                'main_service_id' => null,
            ]),
        ]);

        $service = (new GetServiceUseCase($repository))->execute(2);

        $this->assertSame('SEO', $service['title']);
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

        $this->assertSame(1, $service['id']);
        $this->assertSame('Maintenance', $service['title']);
    }

    public function testItUpdatesService(): void
    {
        $repository = new InMemoryServiceRepository([
            Service::fromArray([
                'id' => 1,
                'title' => 'Old title',
                'description' => null,
                'id_lang' => 1,
                'status' => 1,
                'main_service_id' => null,
            ]),
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
        $this->assertSame('New title', $service['title']);
    }

    public function testItDeletesService(): void
    {
        $repository = new InMemoryServiceRepository([
            Service::fromArray([
                'id' => 1,
                'title' => 'To delete',
                'description' => null,
                'id_lang' => 1,
                'status' => 1,
                'main_service_id' => null,
            ]),
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
        $created = Service::fromArray([
            ...$service->toArray(),
            'id' => $id,
        ]);
        $this->services[$id] = $created;

        return $created;
    }

    public function update(int $id, Service $service): bool
    {
        if (! isset($this->services[$id])) {
            return false;
        }

        $this->services[$id] = Service::fromArray([
            ...$service->toArray(),
            'id' => $id,
        ]);

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
