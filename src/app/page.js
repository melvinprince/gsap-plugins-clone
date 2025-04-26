import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-5xl font-bold">GSAP Plugins Clone</h1>
      <div className="flex gap-4">
        <Link
          href="/split-text"
          className="bg-white text-black py-2 px-4 rounded"
        >
          Test SplitText
        </Link>
        <Link
          href="/animations"
          className="bg-white text-black py-2 px-4 rounded"
        >
          Test Animations
        </Link>
      </div>
    </main>
  );
}
