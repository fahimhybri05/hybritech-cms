<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\ServicePageController;

// Group all service pages routes under the 'api' middleware
Route::middleware('api')->group(function () {
    Route::post('/service-pages', [ServicePageController::class, 'store']);
    Route::get('/service-pages', [ServicePageController::class, 'index']);
    Route::get('/service-pages/{id}', [ServicePageController::class, 'show']);
    Route::put('/service-pages/{id}', [ServicePageController::class, 'update']);
});
