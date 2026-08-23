import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        This page doesn&apos;t exist
      </h1>
      <p className="max-w-[45ch] text-muted-foreground">
        The page you&apos;re looking for may have been moved or deleted.
      </p>
      <Button asChild>
        <Link href="/">Back to BrainWave</Link>
      </Button>
    </div>
  );
}
