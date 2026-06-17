import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import { readTeam } from "@/lib/store";
import "./admin.css";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const team = await readTeam();
  const owner = team.find((m) => m.role === "Administrador") ?? team[0];

  return (
    <div className="admin-shell">
      <Sidebar user={owner} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
