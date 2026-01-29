import React, { useEffect } from 'react';
import { useAuth } from '@/integrations/supabase/auth';
import { useLoginModal } from '@/hooks/use-login-modal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, isLoading } = useAuth();
  const { openModal } = useLoginModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      // User is not logged in, show toast and open modal
      toast.error("You must be signed in to access this page.", {
        duration: 3000,
      });
      openModal();
      // Redirect back to home if access is denied
      navigate('/'); 
    }
  }, [user, isLoading, openModal, navigate]);

  if (isLoading) {
    // Render a loading state while checking auth status
    return <div className="min-h-[80vh] flex items-center justify-center text-primary">Loading authentication...</div>;
  }

  if (!user) {
    // If not logged in, return null as navigation is handled in useEffect
    return null;
  }

  // If logged in, render the element
  return <>{element}</>;
};

export default ProtectedRoute;