<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aktivnost;
use App\Models\Poseta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request, Poseta $visit): JsonResponse
    {
        $this->authorizeVisit($request, $visit);

        $activities = $visit->aktivnosti()->get()->map(fn ($a) => $this->format($a));

        return response()->json($activities);
    }

    public function store(Request $request, Poseta $visit): JsonResponse
    {
        $this->authorizeVisit($request, $visit);

        $data = $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'redosled' => 'nullable|integer|min:1',
        ]);

        if (! isset($data['redosled'])) {
            $data['redosled'] = ($visit->aktivnosti()->max('redosled') ?? 0) + 1;
        }

        $activity = $visit->aktivnosti()->create($data);

        return response()->json($this->format($activity), 201);
    }

    public function update(Request $request, Aktivnost $activity): JsonResponse
    {
        $this->authorizeVisit($request, $activity->poseta);

        $data = $request->validate([
            'naziv' => 'sometimes|string|max:255',
            'opis' => 'nullable|string',
            'redosled' => 'sometimes|integer|min:1',
        ]);

        $activity->update($data);

        return response()->json($this->format($activity));
    }

    public function destroy(Request $request, Aktivnost $activity): JsonResponse
    {
        $this->authorizeVisit($request, $activity->poseta);

        $activity->delete();

        return response()->json(['message' => 'Aktivnost obrisana.']);
    }

    private function authorizeVisit(Request $request, Poseta $visit): void
    {
        abort_if($visit->user_id !== $request->user()->id, 403);
    }

    private function format(Aktivnost $activity): array
    {
        return [
            'id' => $activity->id,
            'posetaId' => $activity->poseta_id,
            'naziv' => $activity->naziv,
            'opis' => $activity->opis,
            'redosled' => $activity->redosled,
        ];
    }
}
