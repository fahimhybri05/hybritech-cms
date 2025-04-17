<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServicePageController;
use App\Http\Controllers\JobApplicationAPIController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('service-pages', [ServicePageController::class, 'store']);
Route::get('service-pages', [ServicePageController::class, 'index']);
Route::get('service-pages/{id}', [ServicePageController::class, 'show']);
Route::put('service-pages/{id}', [ServicePageController::class, 'update']);
Route::delete('service-pages/{id}', [ServicePageController::class, 'destroy']);
Route::get('service-pages/count', [ServicePageController::class, 'count']);
