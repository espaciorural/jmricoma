<?php

namespace App\Controllers;

use App\Models\SectionModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class SectionController extends BaseController
{
    protected $sectionModel;

    public function __construct()
    {
        // Cargar el modelo
        $this->sectionModel = new SectionModel();
    }

    public function index()
    {
        $id_lang = $this->request->getGet('lang');
        
        if ($id_lang) {
            $sections = $this->sectionModel->where('id_lang', $id_lang)->findAll();
        } else {
            $sections = $this->sectionModel->findAll();
        }
    
        return $this->response->setJSON($sections);
    }
}
