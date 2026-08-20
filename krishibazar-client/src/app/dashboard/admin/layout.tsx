import RoleGuard from "@/components/dashboard/RoleGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard role="admin">{children}</RoleGuard>;
}