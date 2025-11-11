"use client";

import {
  CopilotChat,
  CopilotKitProvider,
  useFrontendTool,
  useAgent,
  useAgentContext,
} from "@copilotkitnext/react";
import { useEffect } from "hono/jsx";
import { z } from "zod";
import { uuid } from "zod/v4";

// Disable static optimization for this page
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" showDevConsole="auto">
      <div
        style={{ height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}
      >
        <Chat />
      </div>
    </CopilotKitProvider>
  );
}

function Chat() {
  useFrontendTool({
    name: "sayHello",
    parameters: z.object({
      name: z.string(),
    }),
    render: ({ name, status, args }) => (
      <div className="bg-sky-500 rounded-2xl p-2 my-2">
        <p className="text-white">
          🔧 {status != "complete" ? "Calling" : "Called"} sayHello for{" "}
          {args.name}
        </p>
      </div>
    ),
  });

  const { agent } = useAgent();
  if (!agent) return <div>Loading...</div>;

  // state management, works like useCoAgent
  const { state, setState } = agent;

  // programmatically activate sayHello tool
  const activateSayHello = (name: string) => {
    const toolCallId = crypto.randomUUID();
    agent.addMessages([
      {
        role: "assistant",
        id: crypto.randomUUID(),
        toolCalls: [
          {
            type: "function",
            id: toolCallId,
            function: {
              name: "sayHello",
              arguments: JSON.stringify({ name }), // Valid JSON string
            },
          },
        ],
      },
      {
        role: "tool",
        id: crypto.randomUUID(),
        toolCallId: toolCallId,
        content: `Successfully called sayHello for ${name}`, // The result from the tool execution
      },
    ]);
  };

  return (
    <main className="grid-cols-3 h-full py-10">
      <div className="col-span-1 flex gap-4 px-4">
        <button
          className="bg-sky-500 text-white p-2 rounded-2xl"
          onClick={() => activateSayHello("John")}
        >
          Say hello to John
        </button>
        <button
          className="bg-sky-500 text-white p-2 rounded-2xl"
          onClick={() => activateSayHello("Jane")}
        >
          Say hello to Jane
        </button>
      </div>
      <CopilotChat className="col-span-2" />
    </main>
  );
}
