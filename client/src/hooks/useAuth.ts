import { useQuery } from "@tanstack/react-query";
import type { FrontendUser } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<FrontendUser>({
    queryKey: ["/api/auth/user-public"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && user.id !== 'beta-user',
  };
}