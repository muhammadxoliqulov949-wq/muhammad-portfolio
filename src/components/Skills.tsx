"use client";

import { useEffect, useRef, useState } from "react";

type Skill = {
  id: number;
  name: string;
  level: number;
  category: string;
  order: number;
};

type Props = {
  skills: Skill[];
  bio: string;
  location: string;
  email: string;
};

function SkillBar({ skill, visible }: { skill: Skill; visible: boolean }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-medium text-[15px]">{skill.name}</span>
        <span className="pf-muted text-sm font-semibold">{skill.level}%</span>
      </div>
      <div className="pf-skill-track">
        <div
          className="pf-skill-fill"
          style={
            {
              width: visible ? `${skill.level}%` : "0%",
              "--skill-w": `${skill.level}%`,
              transitionDelay: "120ms",
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

export default function Skills({ skills, bio, location, email }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start" ref={ref}>
      {/* Chap — haqida */}
      <div>
        <span className="pf-kicker">Men haqimda</span>
        <h2 className="pf-title text-[clamp(28px,4vw,40px)] mb-5">
          Texnologiyalarni <span className="pf-grad-text">chuqur</span> o&apos;zlashtirgan
        </h2>
        <p className="pf-muted mb-8">{bio}</p>

        <div className="space-y-3.5">
          {[
            { icon: "📍", text: location },
            { icon: "✉️", text: email },
            { icon: "🎯", text: "Sifat va muddatga qat'iy rioya qilaman" },
            { icon: "🤝", text: "Doimiy aloqa va hisobot berish" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3.5">
              <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-[rgba(0,183,255,0.08)] border border-[rgba(0,183,255,0.2)] text-lg">
                {f.icon}
              </span>
              <span className="text-[15px] pf-muted">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* O'ng — skill lar */}
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue2)]" />
              {cat}
            </h3>
            <div className="space-y-5">
              {skills
                .filter((s) => s.category === cat)
                .sort((a, b) => a.order - b.order)
                .map((s) => (
                  <SkillBar key={s.id} skill={s} visible={visible} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
