"use client";

import { useRouter } from "next/navigation";
import { setUserRole } from "@/lib/actions";

export function RoleToggle({ userId, role }: { userId: string; role: "admin" | "user" }) {
  const router = useRouter();
  return (
    <select
      className="h-9 rounded-md border border-border bg-bg px-2 text-sm"
      defaultValue={role}
      onChange={(e) => {
        const next = e.target.value === "admin" ? "admin" : "user";
        void setUserRole(userId, next).then(() => router.refresh());
      }}
    >
      <option value="user">user</option>
      <option value="admin">admin</option>
    </select>
  );
}
