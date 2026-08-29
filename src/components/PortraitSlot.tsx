"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./ui/Icon";
import PortraitUpload from "./PortraitUpload";

/**
 * Portret freymidagi admin tugmasi («+»).
 *
 * Sayt statik (ISR) render qilinadi — shuning uchun «kim kirgan?» savoli
 * gidratatsiyadan keyin `/api/auth/me` bilan yechiladi: admin bo'lmasa bu
 * komponent hech narsa chiqarmaydi (mehmonlar monogram yoki portretning
 * o'zini ko'radi), admin bo'lsa freym burchagida «+» paydo bo'ladi va
 * ochilgan oynadan rasmni o'zi almashtira oladi.
 */
type Props = { current?: string | null; initials?: string };

export default function PortraitSlot({ current, initials }: Props) {
  const [admin, setAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [changed, setChanged] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { authenticated?: boolean } | null) => {
        if (alive && d?.authenticated) setAdmin(true);
      })
      .catch(() => {
        /* sesionsiz — tugma chiqmaydi */
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  if (!admin) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="portrait-edit"
        aria-label={current ? "Portret almashtirish" : "Portret qo'shish"}
        title={current ? "Portretni almashtirish" : "Portret qo'shish (faqat sizga ko'rinadi)"}
      >
        <Icon name={current ? "pen" : "plus"} size={16} />
        <span className="portrait-edit__label">{current ? "Almashtirish" : "Foto qo'shish"}</span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          if (changed) {
            setChanged(false);
            router.refresh(); // statik sahifa portretning yangi nusxasini oladi
          }
          setOpen(false);
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className="portrait-dialog"
        aria-label="Portret"
      >
        <div className="w-full max-w-[440px] rounded-4 border border-line-1 bg-surface-1 p-5 shadow-3">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="display text-title font-semibold">Portret</h2>
              <p className="text-small text-ink-2">
                Bu tugma faqat admin kirgan holda koʻrinadi; mehmonlar hech narsa oʻzgartira olmaydi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="icon-btn"
              aria-label="Yopish"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <PortraitUpload
            current={current}
            initials={initials}
            compact
            onChanged={() => setChanged(true)}
          />

          <p className="mt-4 text-micro text-ink-3">
            Yuklangan rasm sayt bazasida saqlanadi va barcha qurilmalarga bir xil chiqadi.
          </p>
        </div>
      </dialog>
    </>
  );
}
