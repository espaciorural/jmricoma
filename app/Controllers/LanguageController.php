<?php namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\LanguageModel;

class LanguageController extends Controller
{
    public function index()
    {
        $model = new LanguageModel();
        $data['languages'] = $model->findAll();
        
        return $this->response->setJSON($data);
    }

    public function getLanguageById($id)
    {
        $model = new LanguageModel();
        $language = $model->find($id);

        if (!$language) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Idioma no encontrado']);
        }

        return $this->response->setJSON($language);
    }

    public function create()
    {
        $model = new LanguageModel();
        
        $data = [
            'code' => $this->request->getVar('code'),
            'name' => $this->request->getVar('name'),
        ];
        
        $model->insert($data);
        
        // Redireccionar o responder según corresponda
        return $this->response->setStatusCode(201)->setJSON(['message' => 'Idioma creado']);
    }

    public function update($id)
    {
        $model = new LanguageModel();
        
        $data = [
            'code' => $this->request->getVar('code'),
            'name' => $this->request->getVar('name'),
        ];
        
        $model->update($id, $data);
        
        // Redireccionar o responder según corresponda
        return $this->response->setJSON(['message' => 'Idioma actualizado']);
    }

    public function delete($id)
    {
        $model = new LanguageModel();
        
        $model->delete($id);
        
        // Redireccionar o responder según corresponda
        return $this->response->setStatusCode(200)->setJSON(['message' => 'Idioma eliminado']);
    }
}
