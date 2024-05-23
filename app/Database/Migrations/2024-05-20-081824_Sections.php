<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Sections extends Migration
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
            'name' => [
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
        ]);
        
        // Añadir la clave primaria
        $this->forge->addKey('id', true);

        // Especificar las opciones de la tabla
        $attributes = [
            'ENGINE' => 'InnoDB',
            'DEFAULT CHARSET' => 'utf8mb4',
            'COLLATE' => 'utf8mb4_general_ci',
        ];

        // Crear la tabla con las opciones especificadas
        $this->forge->createTable('sections', true, $attributes);

        // Añadir la clave foránea después de crear la tabla
        $this->db->query('ALTER TABLE sections ADD CONSTRAINT FK_sections_languages FOREIGN KEY (id_lang) REFERENCES languages(id) ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public function down()
    {
        // Eliminar la tabla
        $this->forge->dropTable('sections', true);
    }
}

