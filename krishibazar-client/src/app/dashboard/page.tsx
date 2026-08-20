"use client";

import { useAuth } from "@/context/AuthContext";
import Redirect from "@/components/dashboard/Redirect";
import { roleHome } from "@/lib/dashboard/navigation";

export default function DashboardIndexPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  return <Redirect to={roleHome(user.role)} />;
}