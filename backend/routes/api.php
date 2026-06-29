<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\VisitController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/categories', [DestinationController::class, 'categories']);
Route::get('/destinations/{destination}', [DestinationController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::get('/my-visits', [VisitController::class, 'index']);
    Route::post('/my-visits', [VisitController::class, 'store']);
    Route::put('/my-visits/{visit}', [VisitController::class, 'update']);
    Route::delete('/my-visits/{visit}', [VisitController::class, 'destroy']);

    Route::get('/my-visits/{visit}/activities', [ActivityController::class, 'index']);
    Route::post('/my-visits/{visit}/activities', [ActivityController::class, 'store']);
    Route::put('/activities/{activity}', [ActivityController::class, 'update']);
    Route::delete('/activities/{activity}', [ActivityController::class, 'destroy']);

    Route::get('/statistics', [StatisticsController::class, 'index']);
});
