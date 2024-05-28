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

$routes->get('/api/get-images', 'ImageController::getImages');
$routes->get('/api/check-image/(:segment)/(:segment)', 'ImageController::checkImage/$1/$2');
$routes->post('api/upload-image', 'ImageController::uploadImage');
$routes->delete('api/delete-image/(:segment)', 'ImageController::deleteImage/$1');
$routes->match(['delete', 'options'], '/api/delete-image/(:segment)', 'ImageController::deleteImage/$1');

$routes->group('', ['namespace' => 'App\Controllers'], function($routes) {
    // Rutas para LiteralController
    $routes->get('api/literal', 'LiteralController::get');
    $routes->post('api/literal/create', 'LiteralController::create');
    $routes->put('api/literal/update/(:segment)', 'LiteralController::update/$1');
    $routes->get('api/literal/section/(:segment)', 'LiteralController::getBySection/$1');
    $routes->put('api/literal/update/section/(:segment)', 'LiteralController::updateBySection/$1');
    $routes->options('api/literal/update/section/(:segment)', 'LiteralController::optionsHandler/$1');
    $routes->delete('api/literal/delete/(:segment)', 'LiteralController::delete/$1');

    // Rutas para ServiceController
    $routes->get('api/services', 'ServiceController::index');
    $routes->get('api/services/(:segment)', 'ServiceController::show/$1');
    $routes->post('api/services/create', 'ServiceController::create');
    $routes->options('api/services/create', 'ServiceController::options');
    $routes->put('api/services/update/(:segment)', 'ServiceController::update/$1');
    $routes->options('api/services/update/(:segment)', 'ServiceController::optionsHandler/$1');
    $routes->delete('api/services/delete/(:segment)', 'ServiceController::delete/$1');
    $routes->options('api/services/delete/(:segment)', 'ServiceController::optionsHandler/$1');
});
