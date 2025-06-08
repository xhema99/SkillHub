<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Controllers
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\RecruiterController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminController;

use App\Http\Controllers\ReportController as AdminReportController;

use App\Http\Controllers\CandidateController as AdminCandidateController;

use App\Http\Controllers\RecruiterController as AdminRecruiterController;

// Public routes
Route::post('register', [AuthController::class, 'register'])->name('register');
Route::post('login',    [AuthController::class, 'authenticate'])->name('login');

// Public offers
Route::get('offers',         [OfferController::class, 'index']);
Route::get('offers/{offer}', [OfferController::class, 'show']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Current user
    Route::get('user', function(Request $request) {
        return $request->user();
    });

    // Recruiter routes
    Route::prefix('recruiter')->group(function () {
        Route::get('offers',                      [RecruiterController::class, 'index']);
        Route::post('offers',                     [RecruiterController::class, 'store']);
        Route::get('offers/{offer}/applications', [RecruiterController::class, 'applications']);
        Route::get('messages',                    [MessageController::class, 'threadsRecruiter']);
    });

    // Candidate routes
    Route::prefix('candidate')->group(function () {
        Route::get('applications',                        [CandidateController::class, 'index']);
        Route::post('applications',                       [CandidateController::class, 'store']);
        Route::get('applications/{application}/download', [CandidateController::class, 'download']);
        Route::get('messages',                            [MessageController::class, 'threadsCandidate']);
    });

    // Chat threads
    Route::get('applications/{application}/messages', [MessageController::class, 'index']);
    Route::post('messages',                          [MessageController::class, 'store']);

    // Report offers
    Route::post('reports', [ReportController::class, 'store']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('stats',    [AdminController::class, 'getStats']);
        Route::get('reports',  [AdminController::class, 'getReports']);
        Route::delete('candidates/{candidate}', [CandidateController::class, 'destroy']);
        Route::delete('recruiters/{recruiter}', [RecruiterController::class, 'destroy']);
    });

});
