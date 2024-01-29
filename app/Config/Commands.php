<?php namespace Config;

use CodeIgniter\Config\BaseConfig;

class Commands extends BaseConfig {
    public $commands = [
        'create:access' => [
            'class' => 'App\Commands\CreateAccess',
            'description' => 'Crea un nuevo usuario en la base de datos.',
            'group' => 'custom'
        ],
    ];
}
