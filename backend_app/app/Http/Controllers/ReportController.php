<?php

namespace App\Http\Controllers;

use App\Models\PostReport;
use App\Models\PrestataireReport;
use App\Models\User;
use App\Models\Post;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        // 1. Fetch Prestataire Reports
        $providerReports = PrestataireReport::with(['prestataire.user', 'reporter'])
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'type' => 'prestataire', // Frontend identifier
                    'reported_id' => $report->prestataire_id, // ID of the reported entity
                    'reason' => $report->raison,
                    'created_at' => $report->created_at,
                    'reporter_name' => $report->reporter ? $report->reporter->name : 'Unknown',
                    // Entity details for display
                    'entity_name' => $report->prestataire && $report->prestataire->user 
                        ? $report->prestataire->user->name . ' ' . $report->prestataire->user->surname 
                        : 'Prestataire Inconnu',
                    'entity_details' => $report->prestataire, 
                ];
            });

        // 2. Fetch Post Reports
        $postReports = PostReport::with(['post.prestataire.user', 'post.images', 'reporter'])
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'type' => 'post', // Frontend identifier
                    'reported_id' => $report->post_id,
                    'reason' => $report->raison,
                    'created_at' => $report->created_at,
                    'reporter_name' => $report->reporter ? $report->reporter->name : 'Unknown',
                     // Entity details for display
                    'entity_name' => $report->post && $report->post->prestataire && $report->post->prestataire->user
                        ? 'Post de ' . $report->post->prestataire->user->name
                        : 'Post Inconnu',
                    'entity_details' => $report->post,
                ];
            });

        // Merge and sort by date desc
        $allReports = $providerReports->toBase()->merge($postReports->toBase())->sortByDesc('created_at')->values();

        return response()->json([
            'status' => true,
            'reports' => $allReports
        ]);
    }

    public function destroy($type, $id)
    {
        if ($type === 'prestataire') {
            $report = PrestataireReport::find($id);
            if ($report) {
                $report->delete();
                return response()->json(['status' => true, 'message' => 'Signalement supprimé']);
            }
        } elseif ($type === 'post') {
            $report = PostReport::find($id);
            if ($report) {
                $report->delete();
                return response()->json(['status' => true, 'message' => 'Signalement supprimé']);
            }
        }

        return response()->json(['status' => false, 'message' => 'Signalement non trouvé'], 404);
    }
}
