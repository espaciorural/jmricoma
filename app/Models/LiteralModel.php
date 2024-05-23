<?php namespace App\Models;

use CodeIgniter\Model;

class LiteralModel extends Model
{
    protected $table = 'literals'; // Nombre de tu tabla
    protected $primaryKey = 'id'; // Clave primaria de tu tabla

    protected $useAutoIncrement = true; // Utilizar autoincremento para la clave primaria
    protected $returnType     = 'array'; // Tipo de datos que retornará
    protected $allowedFields = ['lang', 'id_section', 'type', 'text']; // Campos permitidos para asignación masiva


    // Si tu tabla tiene claves foráneas y quieres usar eliminación en cascada o restricciones similares, define aquí tus métodos personalizados.
}
