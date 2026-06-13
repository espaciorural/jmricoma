<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSkillsAndItemToPortfolio extends Migration
{
    public function up()
    {
        $this->forge->addColumn('portfolio', [
            'skills' => [
                'type' => 'VARCHAR',
                'constraint' => 500,
                'null' => true,
                'after' => 'project_url',
            ],
            'item' => [
                'type' => 'INT',
                'constraint' => 5,
                'default' => 0,
                'after' => 'status',
            ],
        ]);

        $this->forge->addKey('item');
    }

    public function down()
    {
        $this->forge->dropColumn('portfolio', ['skills', 'item']);
    }
}
