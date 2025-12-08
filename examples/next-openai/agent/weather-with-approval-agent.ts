import { weatherToolWithApproval } from '@/tool/weather-tool-with-approval';
import { ToolLoopAgent, InferAgentUIMessage, tool } from 'ai';
import { z } from 'zod';

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openRouter = createOpenRouter({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  apiKey: process.env.OPENROUTER_API_KEY,
});

const searchTool = tool({
  description: 'A tool to search for other tools. If other tools do not suite your needs, you can search for them here.',
  inputSchema: z.object({
    query: z.string().describe('The query to search for other tools'),
  }),
  async *execute(params: { query: string }) {
    console.log('executed tools searching with params', params.query)
    yield { state: 'loading' as const }
    yield { state: 'searched tools with query', tools: ['some other tool'] }
  }
})

export const weatherWithApprovalAgent = new ToolLoopAgent({
  model: openRouter.chat('deepseek/deepseek-v3.2'),
  // context engineering required to make sure the model does not retry
  // the tool execution if it is not approved:
  instructions:
    'When a tool execution is not approved by the user, do not retry it.' +
    'Just say that the tool execution was not approved.' + 
    'If you cannot find the tool you need, you can search for it using the search tool.',
  tools: {
    weather: weatherToolWithApproval,
    search: searchTool,
  },
  onStepFinish: ({ request }) => {
    // console.log(JSON.stringify(request.body, null, 2));
  },
});

export type WeatherWithApprovalAgentUIMessage = InferAgentUIMessage<
  typeof weatherWithApprovalAgent
>;
