"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "./ui/Icon";
import { useToast } from "./ui/Toast";

export default function LogoutButton() {
  const router = useRouter();
  const { push } = useToast();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
      push({ variant: "info", title: "Tizimdan chiqdingiz" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={logout} disabled={busy} className="btn btn--sm">
      <Icon name="arrow-up-right" size={14} />
      Chiqish
    </button>
  );
}
