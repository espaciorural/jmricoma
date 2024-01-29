<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->match(['get', 'post', 'options'], '/auth/login', 'Auth::login');
$routes->get('/auth/logout', 'Auth::logout');
