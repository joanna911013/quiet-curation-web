"use client";

import { useEffect } from "react";
import type { ElementType } from "react";

type DeviceType = "phone" | "laptop" | "tv";

type RoutineItem = {
  label: string;
  inches: string;
  device: DeviceType;
};

const MdOutlinedCard = "md-outlined-card" as unknown as ElementType;
const MdFilledCard = "md-filled-card" as unknown as ElementType;
const MdDivider = "md-divider" as unknown as ElementType;

const ROUTINE: RoutineItem[] = [
  { label: "Wake up", inches: '6.7"', device: "phone" },
  { label: "At work", inches: '16"', device: "laptop" },
  { label: "Take a break", inches: '55"', device: "tv" },
  { label: "Before bed", inches: '6.7"', device: "phone" },
];

type ScreenLoopRoutineSectionProps = {
  locale?: "en" | "ko";
};

const routineCopy = {
  en: {
    title: "Most people's daily routine",
    summary:
      "From the first scroll to the last, this loop can shape the whole day.",
    question: "How can you get out of this screen loop trap?",
    screen: "SCREEN",
    labels: ["Wake up", "At work", "Take a break", "Before bed"],
  },
  ko: {
    title: "대부분의 하루 루틴",
    summary: "첫 스크롤부터 마지막 스크롤까지, 이 루프가 하루를 좌우할 수 있어요.",
    question: "이 스크린 루프에서 어떻게 벗어날 수 있을까요?",
    screen: "스크린",
    labels: ["기상 직후", "업무 중", "쉬는 시간", "잠들기 전"],
  },
} as const;

export function ScreenLoopRoutineSection({
  locale = "en",
}: ScreenLoopRoutineSectionProps) {
  const copy = routineCopy[locale];
  const routineItems = ROUTINE.map((item, index) => ({
    ...item,
    label: copy.labels[index] ?? item.label,
  }));

  useEffect(() => {
    void Promise.all([
      import("@material/web/labs/card/outlined-card.js"),
      import("@material/web/labs/card/filled-card.js"),
      import("@material/web/divider/divider.js"),
    ]);
  }, []);

  return (
    <section aria-labelledby="screen-routine-title" className="space-y-4">
      <MdOutlinedCard className="block rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] p-6 font-[inherit] shadow-[0_14px_36px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="mx-auto w-full max-w-5xl">
          <h2
            id="screen-routine-title"
            className="text-center text-[clamp(1.9rem,3.2vw,3rem)] font-semibold tracking-[-0.02em] text-[var(--md-sys-color-on-surface)]"
          >
            {copy.title}
          </h2>

          <div className="relative mt-10">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-[52%] hidden h-[2px] -translate-y-1/2 bg-[color:var(--md-sys-color-outline)] opacity-60 md:block" />

            <div className="grid gap-4 md:grid-cols-4">
              {routineItems.map((item) => (
                <MdFilledCard
                  key={`${item.label}-${item.inches}`}
                  className="block rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] p-4 text-center font-[inherit] shadow-[0_8px_18px_rgba(0,0,0,0.06)]"
                >
                  <p className="text-lg font-medium text-[var(--md-sys-color-on-surface)]">
                    {item.label}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <DeviceGlyph type={item.device} />
                  </div>
                  <p className="mt-4 text-base font-semibold tracking-[0.02em] text-[var(--md-sys-color-on-surface)]">
                    {item.inches} <span className="font-normal opacity-90">{copy.screen}</span>
                  </p>
                </MdFilledCard>
              ))}
            </div>
          </div>

          <div className="mt-8 px-4 py-2 text-center">
            <p className="text-xl font-medium text-[var(--md-sys-color-on-surface)]">
              {copy.summary}
            </p>
          </div>

          <MdDivider className="mt-6 block opacity-75" />

          <div className="mt-6 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] px-4 py-5 text-center">
            <p className="text-[clamp(1.15rem,2.1vw,1.6rem)] font-semibold text-[var(--md-sys-color-on-surface)]">
              {copy.question}
            </p>
          </div>
        </div>
      </MdOutlinedCard>
    </section>
  );
}

function DeviceGlyph({ type }: { type: DeviceType }) {
  if (type === "phone") {
    return (
      <div className="relative h-20 w-12 rounded-[12px] border-[3px] border-[#4a5465] bg-[linear-gradient(145deg,#6ba6f4,#2d6fca)]">
        <div className="absolute left-1/2 top-1 h-1 w-4 -translate-x-1/2 rounded-full bg-[#4a5465]" />
      </div>
    );
  }

  if (type === "laptop") {
    return (
      <div className="relative">
        <div className="h-12 w-24 rounded-t-md border-[3px] border-[#4a5465] bg-[linear-gradient(145deg,#6ba6f4,#2d6fca)]" />
        <div className="mx-auto h-2 w-[106px] rounded-b-md bg-[#4a5465]" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-14 w-28 rounded-md border-[3px] border-[#4a5465] bg-[linear-gradient(145deg,#6ba6f4,#2d6fca)]" />
      <div className="mx-auto mt-1 h-2 w-10 rounded-sm bg-[#4a5465]" />
    </div>
  );
}
