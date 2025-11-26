streamText 说明

- Stream Protocol: AI SDK Core 和 AI SDK UI 的传输协议
    - Messages: ModelMessage
    - UIMessageChunk
- 实际上 AI SDK Core 有好几个不同的流的定义，期间差别都很小，重复定义了好几次
    - LanguageModelV3StreamPart: LLMProvider 的输出
    - SingleRequestTextStreamPart: runToolsTransformation 的输出
    - TextStreamPart: 增加了 start-tep finish-step 消息
    - UIMessagePart: 向 UI 传输的消息
- streamText: 流全景以及数据流转关系
- StitchableStream: 如何进行多轮会话时向客户端保持流式输出
- Tool Approval: 如何实现
- 移植到 golang 需要做哪些变动
    - 不需要做 provider 抽象，暂时只支持 openai compatible API
    - JavaScript Stream API 需要改成 channel
    - 是否可以减少一些中间类型的定义
