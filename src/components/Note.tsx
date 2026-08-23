"use client";

import { Note as NoteModel } from "@/generated/prisma/client";
import { useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        aria-label={`Open note: ${note.title}`}
        className="group cursor-pointer shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 active:translate-y-0"
        onClick={() => setShowEditDialog(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowEditDialog(true);
          }
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 leading-snug">
            {note.title}
          </CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (edited)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {note.content}
          </p>
        </CardContent>
      </Card>
      <AddEditNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
}
