import RoleGuard from "@/components/dashboard/RoleGuard";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard role="farmer">{children}</RoleGuard>;
}