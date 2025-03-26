<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route::post('service-pages', [ServicePageController::class, 'store']);
// Route::get('service-pages', [ServicePageController::class, 'index']);
// Route::get('service-pages/{id}', [ServicePageController::class, 'show']);
// Route::put('service-pages/{id}', [ServicePageController::class, 'update']);