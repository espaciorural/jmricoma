<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->match(['get', 'post', 'options'], '/auth/login', 'Auth::login');
$routes->post('/auth/refresh-token', 'Auth::refreshToken');
$routes->get('/auth/logout', 'Auth::logout');
$routes->get('api/languages', 'LanguageController::index');
$routes->get('api/languages/(:num)', 'LanguageController::getLanguageById/$1');
$routes->get('api/sections', 'SectionController::index');
$routes->group('', ['filter' => 'cors'], function($routes) {
    $routes->post('api/upload-image', 'ImageController::uploadImage');
});
$routes->get('/api/get-images', 'ImageController::getImages');
$routes->group('', ['filter' => 'auth'], function($routes) {
    $routes->match(['delete', 'options'], '/api/delete-image/(:segment)', 'ImageController::deleteImage/$1');
});

$routes->group('', ['namespace' => 'App\Controllers'], function($routes) {
    // Rutas para LiteralController
    $routes->get('api/literal', 'LiteralController::get'); // Obtener todos los literales
    $routes->post('api/literal/create', 'LiteralController::create'); // Crear un nuevo literal
    $routes->put('api/literal/update/(:segment)', 'LiteralController::update/$1'); // Actualizar un literal existente
    $routes->get('api/literal/section/(:segment)', 'LiteralController::getBySection/$1');
    $routes->put('api/literal/update/section/(:segment)', 'LiteralController::updateBySection/$1');
    $routes->options('api/literal/update/section/(:segment)', 'LiteralController::optionsHandler/$1');
    $routes->delete('api/literal/delete/(:segment)', 'LiteralController::delete/$1'); // Eliminar un literal
});
