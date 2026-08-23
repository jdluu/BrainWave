"use client";

import logo from "@/assets/logo.png";
import AIChatButton from "@/components/AIChatButton";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <>
      <header className="glass sticky top-0 z-40 border-b">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Link
            href="/notes"
            className="flex items-center gap-2 rounded-md"
            aria-label="BrainWave home"
          >
            <Image
              src={logo}
              alt=""
              aria-hidden
              width={28}
              height={28}
              className="dark:invert"
            />
            <span className="font-semibold tracking-tight">BrainWave</span>
          </Link>

          <nav
            className="flex items-center gap-2"
            aria-label="Notes actions"
          >
            <div className="hidden sm:block">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: { width: "2.25rem", height: "2.25rem" },
                  },
                }}
              />
            </div>
            <ThemeToggleButton />
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => setShowAddEditNoteDialog(true)}
            >
              <Plus className="mr-1.5 h-4 w-4" strokeWidth={2} />
              Add note
            </Button>
            {/* Icon-only variants for small screens */}
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden"
              aria-label="Add note"
              onClick={() => setShowAddEditNoteDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <AIChatButton />
          </nav>
        </div>
      </header>
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
      {/* UserButton for small screens, rendered in the mobile footer slot */}
      <div className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t px-4 py-2 sm:hidden">
        <span className="text-xs text-muted-foreground">Account</span>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: { width: "2rem", height: "2rem" } },
          }}
        />
      </div>
    </>
  );
}
