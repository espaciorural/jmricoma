<?php

namespace App\Controllers;

use App\Models\SectionModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class SectionController extends BaseController
{
    protected $serviceModel;

    public function __construct()
    {
        // Cargar el modelo
        $this->serviceModel = new SectionModel();
    }

    public function index()
    {
        $id_lang = $this->request->getGet('lang');
        
        if ($id_lang) {
            $sections = $this->serviceModel->where('id_lang', $id_lang)->findAll();
        } else {
            $sections = $this->serviceModel->findAll();
        }
    
        return $this->response->setJSON($sections);
    }
}
