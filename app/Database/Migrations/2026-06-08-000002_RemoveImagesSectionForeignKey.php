<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class RemoveImagesSectionForeignKey extends Migration
{
    public function up()
    {
        $this->db->query('ALTER TABLE images DROP FOREIGN KEY FK_images_sections');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE images ADD CONSTRAINT FK_images_sections FOREIGN KEY (id_section) REFERENCES sections(id) ON DELETE CASCADE ON UPDATE CASCADE');
    }
}
