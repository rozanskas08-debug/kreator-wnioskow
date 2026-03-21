import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseServer = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// ─── AI Review types ────────────────────────────────────────────────────────
export interface AiReviewRecord {
  id: string;
  project_id: string | null;
  project_title: string;
  competition_name: string | null;
  overall_score: number;
  verdict: string;
  verdict_reason: string;
  scores: Record<string, number>;
  critical_errors: string[];
  warnings: string[];
  positives: string[];
  improvements: string[];
  expert_comment: string;
  created_at?: string;
}

// ─── Save review to Supabase ────────────────────────────────────────────────
export async function saveAiReview(review: Omit<AiReviewRecord, 'created_at'>): Promise<void> {
  if (!supabaseUrl || !supabaseSecretKey) return;
  try {
    await supabaseServer.from('ai_reviews').insert(review);
  } catch (e) {
    console.error('[Supabase] Failed to save AI review:', e);
  }
}

// ─── Get recent reviews for learning context ────────────────────────────────
export async function getRecentReviews(limit = 10): Promise<AiReviewRecord[]> {
  if (!supabaseUrl || !supabaseSecretKey) return [];
  try {
    const { data, error } = await supabaseServer
      .from('ai_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as AiReviewRecord[];
  } catch {
    return [];
  }
}

// ─── Build learning context from history ────────────────────────────────────
export function buildLearningContext(reviews: AiReviewRecord[]): string {
  if (reviews.length === 0) return '';

  const passed = reviews.filter(r => r.verdict === 'PRZEJDZIE');
  const risky = reviews.filter(r => r.verdict === 'RYZYKOWNY');
  const failed = reviews.filter(r => r.verdict === 'NIE PRZEJDZIE');

  const lines: string[] = [
    '=== HISTORIA OCEN (kontekst do nauki) ===',
    `Przeanalizowano ${reviews.length} poprzednich wniosków: ${passed.length} przeszło, ${risky.length} ryzykownych, ${failed.length} odrzuconych.`,
    '',
  ];

  // Common errors from failed applications
  if (failed.length > 0) {
    const allErrors = failed.flatMap(r => r.critical_errors ?? []);
    const errorCounts = allErrors.reduce((acc, e) => {
      acc[e] = (acc[e] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topErrors = Object.entries(errorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([e, c]) => `- ${e} (${c}x)`);
    if (topErrors.length > 0) {
      lines.push('Najczęstsze błędy odrzuconych wniosków:');
      lines.push(...topErrors);
      lines.push('');
    }
  }

  // What works in passed applications
  if (passed.length > 0) {
    const allPositives = passed.flatMap(r => r.positives ?? []);
    const posCounts = allPositives.reduce((acc, p) => {
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topPositives = Object.entries(posCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([p, c]) => `- ${p} (${c}x)`);
    if (topPositives.length > 0) {
      lines.push('Co się sprawdza w wygrywających wnioskach:');
      lines.push(...topPositives);
      lines.push('');
    }
  }

  // Average scores
  if (reviews.length > 0) {
    const avgScore = Math.round(reviews.reduce((s, r) => s + (r.overall_score ?? 0), 0) / reviews.length);
    lines.push(`Średni wynik wszystkich ocenionych wniosków: ${avgScore}/100`);
    lines.push('Użyj tej wiedzy, aby ocena była bardziej precyzyjna i oparta na wzorcach.');
  }

  return lines.join('\n');
}
