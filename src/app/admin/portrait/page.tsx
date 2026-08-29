"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PortraitUpload from "@/components/PortraitUpload";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

/**
 * Portret — egasi o'zi yuklaydi va istalgan payt almashtiradi.
 * Kirishdan keyin shu sahifa ochiladi.
 */
export default function AdminPortraitPage() {
  const { push } = useToast();
  const router = useRouter();
  const [current, setCurrent] = useState<string | null>(null);
  const [initials, setInitials] = useState("MX");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/profile", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { photoUrl?: string; avatarInitials?: string; fullName?: string } | null) => {
        if (!alive || !d) return;
        setCurrent(d.photoUrl || null);
        setInitials(d.avatarInitials || d.fullName || "MX");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="stack gap-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-72" rounded="rounded-3" />
      </div>
    );
  }

  return (
    <div className="stack mx-auto max-w-2xl gap-6">
      <div>
        <p className="label label-accent mb-2">Siz boshqarasiz</p>
        <h1 className="display text-display-m">Portret</h1>
        <p className="mt-2 max-w-prose text-body text-ink-2">
          Rasmni men emas, siz qoʻyasiz. Telefon yoki kompyuterdan tanlang — u avtomatik 4:5
          kesiladi va bosh sahifada chiqadi. Keyinroq yana tashlasangiz, eski rasm yangisiga
          almashtiriladi.
        </p>
      </div>

      <Card className="p-5 md:p-8" interactive={false}>
        <PortraitUpload
          current={current}
          initials={initials}
          onChanged={(info) => {
            const url = info?.url ? `${info.url}?v=${Date.now()}` : "";
            setCurrent(url || null);
            push({
              variant: "success",
              title: url ? "Portret saytda" : "Portret olib tashlandi",
              description: url
                ? "Bosh sahifani ochib koʻring. Istalgan payt shu yerga qaytib almashtirasiz."
                : "Endi monogram koʻrinadi. Yangi rasm tashlasangiz, qayta chiqadi.",
            });
            router.refresh();
          }}
          onError={(m) => push({ variant: "error", title: "Yuklab boʻlmadi", description: m })}
        />
      </Card>

      <div className="flex flex-wrap gap-2">
        <Link href="/" className="btn btn--accent">
          <Icon name="eye" size={15} />
          Bosh sahifada koʻrish
        </Link>
        <Link href="/admin" className="btn">
          Profilga qaytish
        </Link>
      </div>
    </div>
  );
}
