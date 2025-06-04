<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServicePageController;
use App\Http\Controllers\JobApplicationAPIController;
use App\Http\Controllers\FormEmailApiController;
use App\Http\Controllers\ContactFormApiController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Service Pages    
Route::post('service-pages', [ServicePageController::class, 'store']);
Route::get('service-pages', [ServicePageController::class, 'index']);
Route::get('service-pages/{id}', [ServicePageController::class, 'show']);
Route::post('service-pages-update/{id}', [ServicePageController::class, 'update']);
Route::delete('service-pages/{id}', [ServicePageController::class, 'destroy']);

// Projects
Route::post('projects', [ProjectController::class, 'store']);
Route::get('projects', [ProjectController::class, 'index']);
Route::get('projects/{id}', [ProjectController::class, 'show']);
Route::put('projects/{id}', [ProjectController::class, 'update']);
Route::delete('projects/{id}', [ProjectController::class, 'destroy']);

// Job Applications
Route::post('/job-applications', [JobApplicationAPIController::class, 'store']);
Route::get('/job-applications', [JobApplicationAPIController::class, 'index']);
Route::get('/selected-candidate-job-applications', [JobApplicationAPIController::class, 'selectedCandidateJobApplications']);
Route::get('/job-applications/{id}', [JobApplicationAPIController::class, 'show']);
Route::patch('/job-applications/{id}', [JobApplicationAPIController::class, 'update']);
Route::get('/job-applications/{id}/attachment', [JobApplicationAPIController::class, 'downloadAttachment']);
Route::delete('/job-applications/{id}', [JobApplicationAPIController::class, 'destroy']);

// Common Forms
Route::post('/common-forms', [FormEmailApiController::class, 'store']);

// Contact Forms
Route::post('/contact-forms', [ContactFormApiController::class, 'store']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
    Route::resource('roles', RoleController::class)->except(['create', 'edit']);
// Role 
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Route::resource('roles', RoleController::class)->except(['create', 'edit']);
    Route::get('permissions', [PermissionController::class, 'index']);
});
 Route::post('/roles', [RoleController::class, 'store']);
  Route::put('/roles/{id}', [RoleController::class, 'update']);