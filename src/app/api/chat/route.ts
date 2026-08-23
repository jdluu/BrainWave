import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { findRelevantNotes } from "@/lib/notes-search";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const messagesTruncated = messages.slice(-6);

    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = messagesTruncated
      .map((message: { content?: unknown }) =>
        typeof message.content === "string" ? message.content : "",
      )
      .join("\n");

    const relevantNotes = await findRelevantNotes(userId, query);

    const systemMessage =
      "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
      "The relevant notes for this query are:\n" +
      relevantNotes
        .map((note) => `Title: ${note.title}\n\nContent:\n${note.content ?? ""}`)
        .join("\n\n");

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      system: systemMessage,
      messages: messagesTruncated.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
