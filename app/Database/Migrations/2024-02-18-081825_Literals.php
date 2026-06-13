<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Literals extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
                'auto_increment' => true
            ],
            'lang' => [
                'type' => 'VARCHAR',
                'constraint' => '2', // ISO 639-1 language codes are 2 letters.
            ],
            'id_section' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
            ],
            'type' => [
                'type' => 'VARCHAR',
                'constraint' => '50', // Asumiendo que 'title', 'subtitle', etc. caben en este límite.
            ],
            'text' => [
                'type' => 'TEXT',
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('id_section', 'sections', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('literals');
    }

    public function down()
    {
        $this->forge->dropTable('literals');
    }
}
