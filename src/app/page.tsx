import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  BotMessageSquare,
  Lock,
  NotebookPen,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: NotebookPen,
    title: "Write without friction",
    body: "Create and edit notes in a clean dialog. Everything autosaves your place.",
  },
  {
    icon: Search,
    title: "Search that understands",
    body: "Notes are embedded locally and matched by meaning, not just keywords.",
  },
  {
    icon: BotMessageSquare,
    title: "Ask your notes anything",
    body: "A chat assistant answers from your own notes and streams replies live.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Every note is scoped to your account. Retrieval never crosses users.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/notes");

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Hero */}
      <main className="bg-hero-glow flex-1">
        <div className="container flex min-h-dvh flex-col justify-center py-16">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <Image
                src={logo}
                alt=""
                aria-hidden
                width={44}
                height={44}
                priority
                className="dark:invert"
              />
              <span className="text-xl font-semibold tracking-tight">
                BrainWave
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
              Your notes, with a{" "}
              <span className="text-primary">memory</span> you can talk to.
            </h1>

            <p className="mt-6 max-w-[55ch] text-lg leading-relaxed text-muted-foreground">
              BrainWave stores your notes, understands what they mean, and
              answers questions with an AI grounded in what you wrote.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/notes">
                  Start writing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Feature grid: asymmetric 2-col rows, not 3 equal cards */}
      <section
        aria-labelledby="features-heading"
        className="border-t bg-secondary/40"
      >
        <div className="container py-20 md:py-28">
          <h2
            id="features-heading"
            className="max-w-xl text-2xl font-semibold tracking-tight md:text-3xl"
          >
            A note app that actually reads your notes.
          </h2>

          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"
                  aria-hidden
                >
                  <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-1 max-w-[45ch] text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-start justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt=""
              aria-hidden
              width={20}
              height={20}
              className="dark:invert"
            />
            <span>BrainWave</span>
          </div>
          <p>Built with Next.js, Groq, Turso, and Clerk.</p>
        </div>
      </footer>
    </div>
  );
}
