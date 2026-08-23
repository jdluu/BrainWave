import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { NotebookPen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
};

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <h1 className="sr-only">Your notes</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allNotes.map((note) => (
          <Note note={note} key={note.id} />
        ))}
      </div>
      {allNotes.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-20 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground"
            aria-hidden
          >
            <NotebookPen className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium">No notes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first note and the AI can start answering questions
              about it.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
