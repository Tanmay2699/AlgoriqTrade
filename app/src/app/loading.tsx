import { LoadingMark } from "@/components/loading-mark";

/**
 * Root loading UI (Next.js App Router convention): shown inside <main> for
 * any route segment that suspends, so it covers the whole site from one
 * file. Layout (nav/footer) stays mounted around it.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingMark />
    </div>
  );
}
