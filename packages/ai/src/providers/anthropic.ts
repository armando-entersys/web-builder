import Anthropic from '@anthropic-ai/sdk'
import type { AIProviderConfig, AIRequest, AIResponse } from '../types'

export class AnthropicProvider {
    private client: Anthropic
    private config: AIProviderConfig

    constructor(config: AIProviderConfig) {
        this.config = config
        this.client = new Anthropic({
            apiKey: config.apiKey
        })
    }

    async generate(request: AIRequest): Promise<AIResponse> {
        const startTime = Date.now()

        try {
            const message = await this.client.messages.create({
                model: request.model || this.config.model,
                max_tokens: request.maxTokens ?? 2000,
                temperature: request.temperature ?? 0.7,
                system: request.systemMessage,
                messages: [
                    { role: 'user', content: request.prompt }
                ]
            })

            const content = message.content[0]?.type === 'text'
                ? message.content[0].text
                : ''

            const tokensUsed = message.usage.input_tokens + message.usage.output_tokens

            // Cost calculation for Claude 3.7 Sonnet
            // Input: $3.00 / 1M tokens, Output: $15.00 / 1M tokens
            const cost = (message.usage.input_tokens * 3.0 / 1_000_000) +
                (message.usage.output_tokens * 15.0 / 1_000_000)

            return {
                content,
                model: (request.model || this.config.model) as any,
                provider: 'anthropic',
                tokensUsed,
                cost
            }
        } catch (error) {
            console.error('Anthropic API Error:', error)
            throw new Error(`Anthropic generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async generateStream(request: AIRequest): Promise<ReadableStream> {
        const stream = await this.client.messages.create({
            model: request.model || this.config.model,
            max_tokens: request.maxTokens || 2000,
            temperature: request.temperature ?? 0.7,
            system: request.systemMessage,
            messages: [
                { role: 'user', content: request.prompt }
            ],
            stream: true
        })

        return new ReadableStream({
            async start(controller) {
                try {
                    for await (const event of stream) {
                        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                            controller.enqueue(new TextEncoder().encode(event.delta.text))
                        }
                    }
                    controller.close()
                } catch (error) {
                    controller.error(error)
                }
            }
        })
    }
}
