<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destinacija;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Destinacija::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('naziv', 'like', "%{$search}%")
                    ->orWhere('drzava', 'like', "%{$search}%")
                    ->orWhere('opis', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->where('kategorija', $category);
        }

        $destinations = $query->orderBy('naziv')->get()->map(fn ($d) => $this->format($d));

        return response()->json($destinations);
    }

    public function show(Destinacija $destination): JsonResponse
    {
        return response()->json($this->format($destination));
    }

    public function categories(): JsonResponse
    {
        $categories = Destinacija::query()
            ->distinct()
            ->orderBy('kategorija')
            ->pluck('kategorija');

        return response()->json($categories);
    }

    private function format(Destinacija $destinacija): array
    {
        return [
            'id' => $destinacija->id,
            'naziv' => $destinacija->naziv,
            'drzava' => $destinacija->drzava,
            'opis' => $destinacija->opis,
            'kategorija' => $destinacija->kategorija,
            'prosecnaOcena' => $destinacija->prosecna_ocena,
            'brojOcena' => $destinacija->broj_ocena,
        ];
    }
}
