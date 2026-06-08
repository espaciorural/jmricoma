<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Portfolio extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'project_url' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
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
            'main_portfolio_id' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
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

        $this->forge->addKey('id', true);
        $this->forge->addKey('id_lang');
        $this->forge->addKey('main_portfolio_id');

        $attributes = [
            'ENGINE' => 'InnoDB',
            'DEFAULT CHARSET' => 'utf8mb4',
            'COLLATE' => 'utf8mb4_general_ci',
        ];

        $this->forge->createTable('portfolio', true, $attributes);

        $this->db->query('ALTER TABLE portfolio ADD CONSTRAINT FK_portfolio_languages FOREIGN KEY (id_lang) REFERENCES languages(id) ON DELETE CASCADE ON UPDATE CASCADE');
        $this->db->query('ALTER TABLE portfolio ADD CONSTRAINT FK_portfolio_main_portfolio FOREIGN KEY (main_portfolio_id) REFERENCES portfolio(id) ON DELETE SET NULL ON UPDATE CASCADE');
    }

    public function down()
    {
        $this->forge->dropTable('portfolio', true);
    }
}
