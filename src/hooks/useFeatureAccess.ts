import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
// Removed UserLevel import from AuthContext
import { useToast } from '@/components/ui/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js'; // Import SupabaseUser type

// Define feature names consistently (used as keys and in DB)
// Note: FeatureName type might still be useful if different features have different *types* of access control later,
// but for now, it's less critical as all are simply allowed/disallowed based on auth.
export type FeatureName =
  | 'ai_chatbot'
  | 'ai_peer_review'
  | 'disease_library'
  | 'drug_reference'
  | 'clinical_guidelines'
  | 'interaction_checker'
  | 'explore_gemini'
  | 'nutrition_database'
  | 'learning_resources';
  // Add other features here if needed

// Removed quotas definition

interface AccessCheckResult {
  allowed: boolean;
  remaining: number | null; // Kept for consistency, but will always be null
  message: string | null; // Message to display if not allowed (only for auth failure now)
  quota: number | null; // Kept for consistency, but will always be null
  currentUsage: number; // Kept for consistency, but will always be 0
  // Removed level property
}

// Removed fetchUserProfileForCheck helper function

export function useFeatureAccess() {
  // toast is still useful for auth errors
  const { toast } = useToast();

  const checkAccess = useCallback(async (featureName: FeatureName): Promise<AccessCheckResult> => {
    const defaultDenied: AccessCheckResult = { allowed: false, remaining: 0, message: 'Authentication required.', quota: 0, currentUsage: 0 };
    const defaultAllowed: AccessCheckResult = { allowed: true, remaining: null, message: null, quota: null, currentUsage: 0 };

    // --- Direct Supabase Auth Check ---
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      console.error(`checkAccess for ${featureName}: Auth error or no user found.`, authError);
      // Optionally show a toast message for auth failure
      // toast({ title: "Access Denied", description: "Please sign in to use this feature.", variant: "destructive" });
      return defaultDenied;
    }
    // --- End Direct Supabase Auth Check ---

    // If authenticated, always allow access (no level/quota check)
    console.log(`checkAccess for ${featureName}: User ${currentUser.id} authenticated. Access granted.`);
    return defaultAllowed;

  }, [supabase]); // Dependency is now only supabase client instance

  // incrementUsage is no longer needed as quotas are removed.
  // Make it an empty async function to avoid breaking existing calls immediately.
  // Consider removing calls to incrementUsage in the components later.
  const incrementUsage = useCallback(async (featureName: FeatureName) => {
    console.log(`incrementUsage called for ${featureName}, but quotas are disabled. Doing nothing.`);
    // No Supabase call, no toast needed unless debugging.
    return Promise.resolve(); // Return a resolved promise
  }, []); // No dependencies needed

  return { checkAccess, incrementUsage };
}
