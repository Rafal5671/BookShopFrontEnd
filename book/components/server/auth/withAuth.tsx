// components/withAuth.tsx

import { useRouter } from "next/router";
import { JSX, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function withAuth<P extends JSX.IntrinsicAttributes>(
    Component: React.ComponentType<P>,
    allowedRoles: string[] = []
  ): React.FC<P> {
    const ProtectedComponent: React.FC<P> = (props: P) => {
      const { token, userRole, loading } = useAuth();
      const router = useRouter();
  
      useEffect(() => {
        if (loading) return;
  
        if (!token) {
          router.push('/login');
        } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || "")) {
          router.push('/unauthorized');
        }
      }, [token, userRole, loading, router]);
  
      if (loading || !token || (allowedRoles.length > 0 && !allowedRoles.includes(userRole || ""))) {
        return null;
      }
  
      return <Component {...props} />;
    };
  
    ProtectedComponent.displayName = `withAuth(${
      Component.displayName || Component.name || 'Component'
    })`;
  
    return ProtectedComponent;
  }
