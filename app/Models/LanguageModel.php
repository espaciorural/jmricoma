<?php namespace App\Models;

use CodeIgniter\Model;

class LanguageModel extends Model
{
    protected $table = 'languages'; // Nombre de tu tabla
    protected $primaryKey = 'id'; // Clave primaria de tu tabla

    protected $useAutoIncrement = true; // Utilizar autoincremento para la clave primaria
    protected $returnType     = 'array'; // Tipo de datos que retornará
    protected $allowedFields = ['code', 'name']; // Campos permitidos para asignación masiva


    // Si tu tabla tiene claves foráneas y quieres usar eliminación en cascada o restricciones similares, define aquí tus métodos personalizados.
}
