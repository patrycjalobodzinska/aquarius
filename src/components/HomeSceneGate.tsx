"use client";

import dynamic from "next/dynamic";

// --- POPRZEDNIA SCENA (szklanka z wodą + krople) - zachowana do późniejszego powrotu ---
// const HomeScene = dynamic(() => import("@/components/HomeScene"), {
//   ssr: false,
//   loading: () => (
//     <div className="flex min-h-svh w-full items-center justify-center bg-zinc-950 text-zinc-400">
//       Ładowanie scen…
//     </div>
//   ),
// });

const BubbleScene = dynamic(() => import("@/components/BubbleScene"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-svh w-full items-center justify-center bg-zinc-950 text-zinc-400">
      Ładowanie sceny…
    </div>
  ),
});

export default function HomeSceneGate() {
  // return <HomeScene />;
  return <BubbleScene />;
}
