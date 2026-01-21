import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message: any) => message.content).join("\n"),
    );

    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes found: ", relevantNotes);

    const systemMessage =
      "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
      "The relevant notes for this query are:\n" +
      relevantNotes
        .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
        .join("\n\n");

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      system: systemMessage,
      messages: messagesTruncated.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}