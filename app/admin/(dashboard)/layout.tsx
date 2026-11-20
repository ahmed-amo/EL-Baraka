import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <AdminShell name={session.name} email={session.email}>
      {children}
    </AdminShell>
  );
}
