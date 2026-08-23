import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404 — Page not found</h1>
      <Link href="/" className="text-primary underline">
        Go home
      </Link>
    </div>
  );
}
