import OpenAI from 'openai'
import type { AIProviderConfig, AIRequest, AIResponse } from '../types'

export class OpenAIProvider {
    private client: OpenAI
    private config: AIProviderConfig

    constructor(config: AIProviderConfig) {
        this.config = config
        this.client = new OpenAI({
            apiKey: config.apiKey
        })
    }

    async generate(request: AIRequest): Promise<AIResponse> {
        const startTime = Date.now()

        try {
            const completion = await this.client.chat.completions.create({
                model: request.model || this.config.model,
                messages: [
                    ...(request.systemMessage ? [{ role: 'system' as const, content: request.systemMessage }] : []),
                    { role: 'user' as const, content: request.prompt }
                ],
                temperature: request.temperature ?? 0.7,
                max_tokens: request.maxTokens ?? 2000,
                stream: request.stream ?? false
            })

            const content = completion.choices[0]?.message?.content || ''
            const tokensUsed = completion.usage?.total_tokens || 0

            // Rough cost calculation for GPT-4o
            // Input: $2.50 / 1M tokens, Output: $10.00 / 1M tokens
            const inputTokens = completion.usage?.prompt_tokens || 0
            const outputTokens = completion.usage?.completion_tokens || 0
            const cost = (inputTokens * 2.5 / 1_000_000) + (outputTokens * 10.0 / 1_000_000)

            return {
                content,
                model: (request.model || this.config.model) as any,
                provider: 'openai',
                tokensUsed,
                cost
            }
        } catch (error) {
            console.error('OpenAI API Error:', error)
            throw new Error(`OpenAI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async generateStream(request: AIRequest): Promise<ReadableStream> {
        const stream = await this.client.chat.completions.create({
            model: request.model || this.config.model,
            messages: [
                ...(request.systemMessage ? [{ role: 'system' as const, content: request.systemMessage }] : []),
                { role: 'user' as const, content: request.prompt }
            ],
            temperature: request.temperature ?? 0.7,
            max_tokens: request.maxTokens ?? 2000,
            stream: true
        })

        // Convert OpenAI stream to web ReadableStream
        return new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || ''
                        if (content) {
                            controller.enqueue(new TextEncoder().encode(content))
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
