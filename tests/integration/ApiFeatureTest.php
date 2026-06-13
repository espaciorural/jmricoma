<?php

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Database;

final class ApiFeatureTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createSchema();
    }

    public function testItListsServicesThroughHttp(): void
    {
        $db = Database::connect('tests');
        $db->table('services')->insert([
            'title' => 'Codex HTTP service',
            'description' => 'Created inside an integration test',
            'id_lang' => 1,
            'status' => 1,
            'item' => 4,
            'main_service_id' => null,
        ]);

        $response = $this->get('/api/services');

        $response->assertOK();
        $payload = json_decode($response->getJSON(), true);

        $this->assertSame('Codex HTTP service', $payload[0]['title']);
        $this->assertSame(1, $payload[0]['id_lang']);
        $this->assertSame(1, $payload[0]['status']);
        $this->assertSame(4, $payload[0]['item']);
    }

    public function testItCreatesServiceThroughHttp(): void
    {
        $response = $this
            ->withBodyFormat('json')
            ->post('/api/services/create', [
                'title' => 'Created over HTTP',
                'description' => 'Feature test payload',
                'id_lang' => 1,
                'status' => 1,
                'item' => 2,
                'main_service_id' => null,
            ]);

        $response->assertStatus(201);
        $response->assertJSONFragment([
            'title' => 'Created over HTTP',
            'description' => 'Feature test payload',
            'item' => 2,
        ]);

        $this->seeInDatabase('services', ['title' => 'Created over HTTP']);
    }

    public function testItRejectsInvalidServicePayloadThroughHttp(): void
    {
        $response = $this
            ->withBodyFormat('json')
            ->post('/api/services/create', [
                'title' => '',
                'id_lang' => 1,
                'status' => 1,
            ]);

        $response->assertStatus(400);
        $response->assertJSONFragment(['status' => 400]);
    }

    public function testItCreatesPortfolioItemThroughHttp(): void
    {
        $response = $this
            ->withBodyFormat('json')
            ->post('/api/portfolio/create', [
                'title' => 'Portfolio HTTP project',
                'description' => 'Portfolio integration payload',
                'project_url' => 'https://example.com/project',
                'skills' => 'PHP, Symfony',
                'id_lang' => 1,
                'status' => 1,
                'item' => 3,
                'main_portfolio_id' => null,
            ]);

        $response->assertStatus(201);
        $response->assertJSONFragment([
            'title' => 'Portfolio HTTP project',
            'project_url' => 'https://example.com/project',
            'skills' => 'PHP, Symfony',
            'item' => 3,
        ]);

        $this->seeInDatabase('portfolio', ['title' => 'Portfolio HTTP project']);
    }

    public function testItListsPortfolioItemsThroughHttp(): void
    {
        $db = Database::connect('tests');
        $db->table('portfolio')->insert([
            'title' => 'Listed portfolio project',
            'description' => 'Visible over HTTP',
            'project_url' => null,
            'skills' => 'React, API',
            'id_lang' => 1,
            'status' => 1,
            'item' => 2,
            'main_portfolio_id' => null,
        ]);

        $response = $this->get('/api/portfolio');

        $response->assertOK();
        $payload = json_decode($response->getJSON(), true);

        $this->assertSame('Listed portfolio project', $payload[0]['title']);
        $this->assertSame(1, $payload[0]['id_lang']);
        $this->assertSame('React, API', $payload[0]['skills']);
        $this->assertSame(2, $payload[0]['item']);
    }

    public function testItDeletesPortfolioGalleryImagesWhenDeletingPortfolioItemThroughHttp(): void
    {
        $db = Database::connect('tests');
        $db->table('portfolio')->insert([
            'title' => 'Portfolio with gallery',
            'description' => null,
            'project_url' => null,
            'skills' => null,
            'id_lang' => 1,
            'status' => 1,
            'item' => 0,
            'main_portfolio_id' => null,
        ]);
        $portfolioId = $db->insertID();
        $relativePath = 'uploads/codex_portfolio_gallery_test.webp';
        $absolutePath = PUBLICPATH . $relativePath;

        if (! is_dir(dirname($absolutePath))) {
            mkdir(dirname($absolutePath), 0777, true);
        }

        file_put_contents($absolutePath, 'fake image content');

        $db->table('images')->insert([
            'path' => $relativePath,
            'id_section' => $portfolioId,
            'type' => 'portfolio_gallery',
        ]);

        $response = $this->delete('/api/portfolio/delete/' . $portfolioId);

        $response->assertStatus(200);
        $this->dontSeeInDatabase('images', [
            'id_section' => $portfolioId,
            'type' => 'portfolio_gallery',
        ]);
        $this->assertFileDoesNotExist($absolutePath);
    }

    public function testItListsImagesThroughHttp(): void
    {
        $db = Database::connect('tests');
        $db->table('images')->insert([
            'path' => 'uploads/header.webp',
            'id_section' => 1,
            'type' => 'header',
        ]);

        $response = $this->get('/api/get-images?sectionId=1&type=header');

        $response->assertOK();
        $payload = json_decode($response->getJSON(), true);

        $this->assertSame(1, $payload['images'][0]['id']);
        $this->assertSame('http://example.com/uploads/header.webp', $payload['images'][0]['path']);
    }

    public function testItReturnsNotFoundWhenDeletingMissingImageThroughHttp(): void
    {
        $response = $this->delete('/api/delete-image/99');

        $response->assertStatus(404);
        $response->assertJSONFragment(['status' => 404]);
    }

    public function testItRejectsUploadWithoutFileThroughHttp(): void
    {
        $response = $this->post('/api/upload-image', [
            'id_section' => 1,
            'type' => 'header',
        ]);

        $response->assertStatus(400);
        $response->assertJSONFragment([
            'status' => 'error',
            'message' => 'Archivo invalido o error de carga',
        ]);
    }

    public function testItRejectsInvalidContactPayloadThroughHttp(): void
    {
        $response = $this
            ->withBodyFormat('json')
            ->post('/api/contact', [
                'name' => '',
                'email' => 'not-an-email',
                'message' => '',
                'captchaToken' => '',
            ]);

        $response->assertStatus(400);
        $response->assertJSONFragment(['status' => 400]);
    }

    private function createSchema(): void
    {
        $db = Database::connect('tests');
        $forge = Database::forge('tests');

        $forge->dropTable('services', true);
        $forge->dropTable('portfolio', true);
        $forge->dropTable('images', true);

        $forge->addField([
            'id' => [
                'type' => 'INTEGER',
                'auto_increment' => true,
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'id_lang' => [
                'type' => 'INTEGER',
            ],
            'status' => [
                'type' => 'INTEGER',
            ],
            'item' => [
                'type' => 'INTEGER',
                'default' => 0,
            ],
            'main_service_id' => [
                'type' => 'INTEGER',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $forge->addKey('id', true);
        $forge->createTable('services');

        $forge->addField([
            'id' => [
                'type' => 'INTEGER',
                'auto_increment' => true,
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'project_url' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'skills' => [
                'type' => 'VARCHAR',
                'constraint' => 500,
                'null' => true,
            ],
            'id_lang' => [
                'type' => 'INTEGER',
            ],
            'status' => [
                'type' => 'INTEGER',
            ],
            'item' => [
                'type' => 'INTEGER',
                'default' => 0,
            ],
            'main_portfolio_id' => [
                'type' => 'INTEGER',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $forge->addKey('id', true);
        $forge->createTable('portfolio');

        $forge->addField([
            'id' => [
                'type' => 'INTEGER',
                'auto_increment' => true,
            ],
            'path' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'id_section' => [
                'type' => 'INTEGER',
            ],
            'type' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],
        ]);
        $forge->addKey('id', true);
        $forge->createTable('images');

        $db->query('DELETE FROM ' . $db->protectIdentifiers('services', true));
        $db->query('DELETE FROM ' . $db->protectIdentifiers('portfolio', true));
        $db->query('DELETE FROM ' . $db->protectIdentifiers('images', true));
    }
}
