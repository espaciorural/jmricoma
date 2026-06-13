<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Images extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 5,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'path' => [
                'type'       => 'VARCHAR',
                'constraint' => '255', // Ruta del archivo o URL de la imagen.
            ],
            'id_section' => [
                'type'       => 'INT',
                'constraint' => 5,
                'unsigned'   => true,
            ],
            'type' => [
                'type'       => 'VARCHAR',
                'constraint' => '50', // Tipo de imagen, p.ej., 'portada', 'perfil', etc.
            ],
        ]);

        $this->forge->addKey('id', true);

        $attributes = [
            'ENGINE' => 'InnoDB',
            'DEFAULT CHARSET' => 'utf8mb4',
            'COLLATE' => 'utf8mb4_general_ci',
        ];

        // Crear la tabla con las opciones especificadas
        $this->forge->createTable('images', true, $attributes);

        // Añadir la clave foránea después de crear la tabla
        $this->db->query('ALTER TABLE images ADD CONSTRAINT FK_images_sections FOREIGN KEY (id_section) REFERENCES sections(id) ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public function down()
    {
        $this->forge->dropTable('images', true); // El parámetro 'true' protege contra la eliminación accidental de la tabla.
    }
}
