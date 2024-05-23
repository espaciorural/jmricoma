<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Languages extends Migration
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
            'code' => [
                'type'       => 'VARCHAR',
                'constraint' => '2', // Para almacenar códigos de dos letras como ES, EN, etc.
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => '255', // Asumiendo que el nombre completo del idioma no superará los 255 caracteres
            ],
        ]);
        $this->forge->addKey('id', true); // Establece 'id' como clave primaria
        $this->forge->createTable('languages'); // Crea la tabla 'languages'
    }

    public function down()
    {
        $this->forge->dropTable('languages'); // Elimina la tabla 'languages' si se revierte la migración
    }
}
