<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddItemAndTimestampsToServices extends Migration
{
    public function up()
    {
        $this->forge->addColumn('services', [
            'item' => [
                'type' => 'INT',
                'constraint' => 5,
                'default' => 0,
                'after' => 'status',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'main_service_id',
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'created_at',
            ],
        ]);

        $this->forge->addKey('item');
    }

    public function down()
    {
        $this->forge->dropColumn('services', ['item', 'created_at', 'updated_at']);
    }
}
