<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\MoviesController;
use App\Http\Controllers\RoomsController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\SeatsController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UpcomingsController;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('users', [MoviesController::class, 'getUsers']); // Get all movies


//Movies
Route::post('movie/create-movie', [MoviesController::class, 'store']); // Create pelicula
Route::get('movies', [MoviesController::class, 'index']); // Get all movies
Route::delete('movies/{id}', [MoviesController::class, 'destroy']); // Delete movie
Route::put('movies/{id}', [MoviesController::class, 'updatePrice']); // Updatear price


//Rooms
Route::post('room/create-room', [RoomsController::class, 'store']); // Crear rooms
Route::get('rooms', [RoomsController::class, 'index']); // Get all rooms
Route::delete('rooms/{id}', [RoomsController::class, 'destroy']); // Delete room

//Seats
Route::get('/seats', [SeatsController::class, 'index']); // Get all seats
Route::post('/seats/create-seats', [SeatsController::class, 'store']); // Create seats

//MovieSchedules
Route::get('/movie-schedules', [SchedulesController::class, 'index']); // Get all seats
Route::post('/movie-schedules/create-schedules', [SchedulesController::class, 'store']); // Create Movie Schedules

//Tickets
Route::get('/historial', [TicketController::class, 'getHistorial']); // Historial por user
Route::post('/ticket', [TicketController::class, 'storeTicket']); // Select silla
Route::post('/payment', [TicketController::class, 'storePayment']); // Pagar 1 o múltiple tickets x array
Route::post('/refund/{ticket_id}', [TicketController::class, 'refund']); // Refundar

// Comments on movie
Route::post('/comments/movie/{id}', [CommentsController::class, 'store']); // Publkicar comentario
Route::get('comments', [CommentsController::class, 'index']); // Get all comments
Route::get('/comments/{id}', [CommentsController::class, 'show']); // Comment x id
Route::delete('/comments/{id}', [CommentsController::class, 'destroy']); // Borrar comentario x user

//Upcoming movies
Route::post('post/upcoming-releases', [UpcomingsController::class, 'store']); // Publkicar comentario
Route::get('upcoming-releases', [UpcomingsController::class, 'index']); // Get all comments
Route::get('/upcoming-releases/{id}', [UpcomingsController::class, 'show']); // Comment x id





// Auth route
Route::group(['middleware' => 'api','prefix' => 'auth'], function ($router) {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
});


