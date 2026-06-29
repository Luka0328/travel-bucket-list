<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $visits = $user->posete();

        return response()->json([
            'ukupnoDestinacija' => (clone $visits)->count(),
            'planirane' => (clone $visits)->where('status', 'planiram')->count(),
            'posecene' => (clone $visits)->where('status', 'poseceno')->count(),
            'ukupnoAktivnosti' => $user->posete()->withCount('aktivnosti')->get()->sum('aktivnosti_count'),
        ]);
    }
}
