import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProviderConfig, AIRequest, AIResponse } from '../types'

export class GoogleAIProvider {
    private client: GoogleGenerativeAI
    private config: AIProviderConfig

    constructor(config: AIProviderConfig) {
        this.config = config
        this.client = new GoogleGenerativeAI(config.apiKey)
    }

    async generate(request: AIRequest): Promise<AIResponse> {
        const startTime = Date.now()

        try {
            const model = this.client.getGenerativeModel({
                model: request.model || this.config.model
            })

            // Combine system message with prompt if provided
            const fullPrompt = request.systemMessage
                ? `${request.systemMessage}\n\n${request.prompt}`
                : request.prompt

            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                generationConfig: {
                    temperature: request.temperature ?? 0.7,
                    maxOutputTokens: request.maxTokens ?? 2000,
                }
            })

            const response = result.response
            const content = response.text()

            // Google doesn't provide exact  token counts in the same way
            // Estimate based on character count (rough approximation: 4 chars = 1 token)
            const estimatedTokens = Math.ceil((fullPrompt.length + content.length) / 4)

            // Cost calculation for Gemini 2.0 Flash (very low cost)
            // Free tier available, paid: $0.075 / 1M input tokens, $0.30 / 1M output tokens
            const inputTokens = Math.ceil(fullPrompt.length / 4)
            const outputTokens = Math.ceil(content.length / 4)
            const cost = (inputTokens * 0.075 / 1_000_000) + (outputTokens * 0.30 / 1_000_000)

            return {
                content,
                model: (request.model || this.config.model) as any,
                provider: 'google',
                tokensUsed: estimatedTokens,
                cost
            }
        } catch (error) {
            console.error('Google AI API Error:', error)
            throw new Error(`Google AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async generateStream(request: AIRequest): Promise<ReadableStream> {
        const model = this.client.getGenerativeModel({
            model: request.model || this.config.model
        })

        const fullPrompt = request.systemMessage
            ? `${request.systemMessage}\n\n${request.prompt}`
            : request.prompt

        const result = await model.generateContentStream({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
                temperature: request.temperature ?? 0.7,
                maxOutputTokens: request.maxTokens ?? 2000,
            }
        })

        return new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text()
                        if (text) {
                            controller.enqueue(new TextEncoder().encode(text))
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
