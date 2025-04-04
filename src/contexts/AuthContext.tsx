import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// User type without level
type User = {
  id: string;
  email?: string;
  // Add other fields from Supabase user or profile if needed
};

interface AuthContextType {
  user: User | null;
  session: Session | null; // Expose session if needed
  isAuthenticated: boolean;
  loading: boolean; // Add loading state
  login: (email: string, password: string) => Promise<any>; // Return type depends on Supabase response
  register: (email: string, password: string) => Promise<any>; // Return type depends on Supabase response
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Start loading

  // Function to fetch basic user info (no level needed)
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    // No need to fetch profile just for level anymore
    // If other profile data were needed, fetch it here.
    // For now, just return the basic info from the Supabase user object.
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
    };
  };


  useEffect(() => {
    setLoading(true);
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const handleAuthChange = async (session: Session | null) => {
      if (!isMounted) return;

      setSession(session);
      setIsAuthenticated(!!session);

      if (session?.user) {
        const userData = await fetchUserProfile(session.user); // Renamed from profileData
        if (isMounted) {
          setUser(userData);
          // setLevel removed
        }
      } else {
        if (isMounted) {
          setUser(null);
          // setLevel removed
        }
      }
      if (isMounted) {
         setLoading(false); // Set loading false after processing auth state
      }
    };

    // Get initial session and profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session); // Process initial session
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Don't setLoading(true) here, only on explicit actions like login/logout/register
      handleAuthChange(session); // Process subsequent changes
    });

    // Cleanup listener on unmount
    return () => {
      isMounted = false; // Set flag to false on unmount
      authListener?.subscription.unsubscribe(); // Call unsubscribe directly
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
    return data;
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    // Note: Supabase signUp might require email confirmation by default
    // This function now ONLY handles the Supabase Auth sign-up.
    // Profile creation is handled separately (e.g., in SignUp.tsx for Free, or via webhook for Premium).
    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false); // Set loading false regardless of profile creation here

    if (error) {
      throw error;
    }

    // Return the sign-up data (user, session)
    // The calling component (SignUp.tsx) will decide what to do next based on the plan.
    return data;
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // State updates will be handled by onAuthStateChange listener
    setLoading(false);
  };

  // Don't render children until initial auth check is complete
  if (loading) {
     return <div>Loading Authentication...</div>; // Or a proper loading spinner component
   }

  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
