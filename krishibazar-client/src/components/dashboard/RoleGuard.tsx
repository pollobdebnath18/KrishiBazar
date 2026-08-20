"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { roleHome, type DashboardRole } from "@/lib/dashboard/navigation";
import Redirect from "./Redirect";

interface RoleGuardProps {
  role: DashboardRole;
  children: ReactNode;
}

export default function RoleGuard({ role, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  if (user.role !== role) {
    return <Redirect to={roleHome(user.role)} />;
  }

  return <>{children}</>;
}