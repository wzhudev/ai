import { weatherToolWithApproval } from '@/tool/weather-tool-with-approval';
import { ToolLoopAgent, InferAgentUIMessage } from 'ai';

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openRouter = createOpenRouter({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const weatherWithApprovalAgent = new ToolLoopAgent({
  model: openRouter.chat('Qwen/Qwen3-VL-235B-A22B-Instruct'),
  // context engineering required to make sure the model does not retry
  // the tool execution if it is not approved:
  instructions:
    'When a tool execution is not approved by the user, do not retry it.' +
    'Just say that the tool execution was not approved.',
  tools: {
    weather: weatherToolWithApproval,
  },
  onStepFinish: ({ request }) => {
    console.log(JSON.stringify(request.body, null, 2));
  },
});

export type WeatherWithApprovalAgentUIMessage = InferAgentUIMessage<
  typeof weatherWithApprovalAgent
>;
