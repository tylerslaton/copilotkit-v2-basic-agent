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
    handler: async ({ name }) => {
      alert(`Hello ${name}`);
      return `Hello ${name}`;
    },
    render: ({ name, status, args }) => (
      <div className="bg-sky-500 rounded-2xl p-2">
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

  return <CopilotChat threadId="xyz" />;
}
