<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Services extends Migration
{
    public function up()
    {
        // Definir los campos de la tabla
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
                'auto_increment' => true
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'id_lang' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
            ],
            'status' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
            ],
            'main_service_id' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
                'null' => true,
            ],
        ]);
        
        // Añadir la clave primaria
        $this->forge->addKey('id', true);
        
        // Añadir índices
        $this->forge->addKey('id_lang');
        $this->forge->addKey('main_service_id');

        // Especificar las opciones de la tabla
        $attributes = [
            'ENGINE' => 'InnoDB',
            'DEFAULT CHARSET' => 'utf8mb4',
            'COLLATE' => 'utf8mb4_general_ci',
        ];

        // Crear la tabla con las opciones especificadas
        $this->forge->createTable('services', true, $attributes);

        // Añadir las claves foráneas después de crear la tabla
        $this->db->query('ALTER TABLE services ADD CONSTRAINT FK_services_languages FOREIGN KEY (id_lang) REFERENCES languages(id) ON DELETE CASCADE ON UPDATE CASCADE');
        $this->db->query('ALTER TABLE services ADD CONSTRAINT FK_services_main_service FOREIGN KEY (main_service_id) REFERENCES services(id) ON DELETE SET NULL ON UPDATE CASCADE');
    }

    public function down()
    {
        // Eliminar la tabla
        $this->forge->dropTable('services', true);
    }
}
