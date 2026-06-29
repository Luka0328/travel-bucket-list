<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destinacija;
use App\Models\Poseta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->posete()->with(['destinacija', 'aktivnosti']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $visits = $query->orderByDesc('datum_dodavanja')->get()
            ->map(fn ($v) => $this->format($v));

        return response()->json($visits);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'destinacija_id' => 'required|exists:destinacije,id',
        ]);

        $existing = Poseta::where('user_id', $request->user()->id)
            ->where('destinacija_id', $data['destinacija_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Destinacija je već na vašoj listi.'], 422);
        }

        $visit = Poseta::create([
            'user_id' => $request->user()->id,
            'destinacija_id' => $data['destinacija_id'],
            'status' => 'planiram',
            'datum_dodavanja' => now()->toDateString(),
        ]);

        $visit->load('destinacija');

        return response()->json($this->format($visit), 201);
    }

    public function update(Request $request, Poseta $visit): JsonResponse
    {
        $this->authorizeVisit($request, $visit);

        $data = $request->validate([
            'status' => 'sometimes|in:planiram,poseceno',
            'datum_putovanja' => 'nullable|date',
            'ocena' => 'nullable|integer|min:1|max:10',
            'napomena' => 'nullable|string',
        ]);

        $oldRating = $visit->ocena;

        $visit->fill($data);
        $visit->save();

        if (array_key_exists('ocena', $data) && $data['ocena'] !== null) {
            $this->recalculateDestinationRating($visit->destinacija_id, $oldRating, $data['ocena']);
        }

        $visit->load('destinacija');

        return response()->json($this->format($visit));
    }

    public function destroy(Request $request, Poseta $visit): JsonResponse
    {
        $this->authorizeVisit($request, $visit);

        if ($visit->ocena !== null) {
            $this->recalculateDestinationRating($visit->destinacija_id, $visit->ocena, null);
        }

        $visit->delete();

        return response()->json(['message' => 'Destinacija uklonjena sa liste.']);
    }

    private function authorizeVisit(Request $request, Poseta $visit): void
    {
        abort_if($visit->user_id !== $request->user()->id, 403);
    }

    private function recalculateDestinationRating(int $destinacijaId, ?int $oldRating, ?int $newRating): void
    {
        DB::transaction(function () use ($destinacijaId, $oldRating, $newRating) {
            $destinacija = Destinacija::lockForUpdate()->findOrFail($destinacijaId);

            $total = $destinacija->prosecna_ocena * $destinacija->broj_ocena;

            if ($oldRating !== null) {
                $total -= $oldRating;
                $destinacija->broj_ocena = max(0, $destinacija->broj_ocena - 1);
            }

            if ($newRating !== null) {
                $total += $newRating;
                $destinacija->broj_ocena += 1;
            }

            $destinacija->prosecna_ocena = $destinacija->broj_ocena > 0
                ? round($total / $destinacija->broj_ocena, 2)
                : 0;

            $destinacija->save();
        });
    }

    private function format(Poseta $visit): array
    {
        $data = [
            'id' => $visit->id,
            'destinacijaId' => $visit->destinacija_id,
            'status' => $visit->status,
            'datumDodavanja' => $visit->datum_dodavanja?->format('Y-m-d'),
            'datumPutovanja' => $visit->datum_putovanja?->format('Y-m-d'),
            'ocena' => $visit->ocena,
            'napomena' => $visit->napomena,
            'destinacija' => $visit->destinacija ? [
                'id' => $visit->destinacija->id,
                'naziv' => $visit->destinacija->naziv,
                'drzava' => $visit->destinacija->drzava,
                'opis' => $visit->destinacija->opis,
                'kategorija' => $visit->destinacija->kategorija,
                'prosecnaOcena' => $visit->destinacija->prosecna_ocena,
                'brojOcena' => $visit->destinacija->broj_ocena,
            ] : null,
        ];

        if ($visit->relationLoaded('aktivnosti')) {
            $data['aktivnosti'] = $visit->aktivnosti->map(fn ($a) => [
                'id' => $a->id,
                'naziv' => $a->naziv,
                'opis' => $a->opis,
                'redosled' => $a->redosled,
            ])->values()->all();
        }

        return $data;
    }
}
