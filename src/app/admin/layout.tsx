import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
