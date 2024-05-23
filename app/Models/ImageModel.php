<?php

namespace App\Models;

use CodeIgniter\Model;

class ImageModel extends Model
{
    protected $table = 'images'; // Define el nombre de la tabla asociada al modelo
    protected $primaryKey = 'id'; // Define la clave primaria de la tabla

    protected $useAutoIncrement = true; // Usa autoincremento para la clave primaria
    protected $returnType     = 'array'; // Tipo de datos que devuelve el modelo
    protected $allowedFields = ['path', 'id_section', 'type']; // Define los campos que se pueden insertar o actualizar

    protected $useTimestamps = false; // Activa o desactiva las marcas de tiempo automáticas. Ajusta según necesites

    // Define cualquier comportamiento adicional necesario para tu modelo aquí
}
