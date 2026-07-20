"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Plus,
  LogOut,
  Palette,
  Home,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavPendingIndicator } from "@/components/admin/NavPendingIndicator";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Pinturas",
    href: "/admin/paintings",
    icon: Images,
  },
  {
    label: "Nueva Pintura",
    href: "/admin/paintings/new",
    icon: Plus,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-[100dvh] w-64 max-w-full flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border px-4">
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className="flex items-center gap-2"
        >
          <Palette className="h-5 w-5 text-primary" />
          <span className="font-serif text-base font-semibold">Milo Paints</span>
        </Link>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              <NavPendingIndicator
                className={
                  isActive ? "text-primary-foreground" : "text-primary"
                }
              />
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 space-y-1 border-t border-border bg-card p-3">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">Ver Galería</span>
          <NavPendingIndicator />
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
