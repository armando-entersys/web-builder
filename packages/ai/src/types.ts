/**
 * AI Provider Types and Interfaces
 */

export type AIProvider = 'openai' | 'anthropic' | 'google'

export type AIModel =
    | 'gpt-4o'
    | 'gpt-4o-mini'
    | 'claude-3-7-sonnet'
    | 'claude-3-5-sonnet'
    | 'gemini-2.0-flash'
    | 'gemini-1.5-pro'

export interface AIRequest {
    prompt: string
    systemMessage?: string
    model?: AIModel
    temperature?: number
    maxTokens?: number
    stream?: boolean
}

export interface AIResponse {
    content: string
    model: AIModel
    provider: AIProvider
    tokensUsed: number
    cost?: number
}

export interface AIProviderConfig {
    apiKey: string
    model: AIModel
    maxRetries?: number
}

export interface AIGenerationMetrics {
    provider: AIProvider
    model: AIModel
    tokensUsed: number
    cost: number
    duration: number
    success: boolean
    error?: string
}
