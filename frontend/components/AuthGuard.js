import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

/**
 * AuthGuard - Role-based route protection
 * @param {Array} allowedRoles - Array of allowed roles ['farmer', 'owner', 'admin']
 * @param {ReactNode} children - Protected content
 */
const AuthGuard = ({ allowedRoles = [], children }) => {
  const router = useRouter();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only run auth checks on client side
    setIsChecking(false);

    if (!isAuthenticated) {
      // Not logged in - redirect to login
      router.replace('/login');
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      // Logged in but wrong role - redirect to their dashboard
      switch (role) {
        case 'farmer':
          router.replace('/');
          break;
        case 'owner':
          router.replace('/owner/dashboard');
          break;
        case 'admin':
          router.replace('/admin/dashboard');
          break;
        default:
          router.replace('/login');
      }
    }
  }, [isAuthenticated, role, allowedRoles, router]);

  // Show loading while checking auth or during redirect
  if (isChecking || !isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
