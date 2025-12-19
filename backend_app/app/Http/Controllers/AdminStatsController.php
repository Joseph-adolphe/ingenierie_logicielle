<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\PostLike;
use App\Models\Prestataire;
use App\Models\PostReport;
use App\Models\PrestataireReport;
use Illuminate\Http\Request;

class AdminStatsController extends Controller
{
    //
    public function index()
    {
        $reportsCount = PostReport::count() + PrestataireReport::count();

        // Helper function to get monthly stats using Collections
        $getMonthlyStats = function ($model) {
            return $model::select('created_at')
                ->whereYear('created_at', now()->year)
                ->get()
                ->groupBy(function ($date) {
                    return $date->created_at->format('m');
                })
                ->map(function ($row) {
                    return $row->count();
                })
                ->map(function ($count, $month) {
                    return ['month' => (int)$month, 'total' => $count];
                })
                ->values();
        };

        return response()->json([
            'users_count' => User::count(),
            'prestataires_count' => Prestataire::count(),
            'posts_count' => Post::count(),
            'comments_count' => Comment::count(),
            'likes_count' => PostLike::count(),
            'reports_count' => $reportsCount,

            'new_users_month' => User::whereMonth('created_at', now()->month)->count(),
            'new_posts_month' => Post::whereMonth('created_at', now()->month)->count(),
            
            'new_users_today' => User::whereDate('created_at', today())->count(),
            'new_prestataires_today' => Prestataire::whereDate('created_at', today())->count(),

            'top_prestataires' => Prestataire::withCount('posts')
                ->orderBy('posts_count', 'desc')
                ->take(5)
                ->get(),

            'top_posts' => Post::withCount('likes')
                ->orderBy('likes_count', 'desc')
                ->take(5)
                ->with('prestataire')
                ->get(),

            'monthly_stats' => [
                'users' => $getMonthlyStats(User::class),
                'posts' => $getMonthlyStats(Post::class),
                'prestataires' => $getMonthlyStats(Prestataire::class),
            ],
        ]);
    }
}
