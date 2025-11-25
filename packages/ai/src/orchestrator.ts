import { OpenAIProvider } from './providers/openai'
import { AnthropicProvider } from './providers/anthropic'
import { GoogleAIProvider } from './providers/google'
import type { AIProvider, AIRequest, AIResponse, AIGenerationMetrics } from './types'

/**
 * AI Orchestrator - Routes requests to appropriate AI provider with fallback strategy
 */
export class AIOrchestrator {
    private openai: OpenAIProvider | null = null
    private anthropic: AnthropicProvider | null = null
    private google: GoogleAIProvider | null = null

    private preferredProvider: AIProvider = 'openai'
    private fallbackOrder: AIProvider[] = ['openai', 'anthropic', 'google']

    constructor(config: {
        openaiKey?: string
        anthropicKey?: string
        googleKey?: string
        preferredProvider?: AIProvider
    }) {
        // Initialize available providers
        if (config.openaiKey) {
            this.openai = new OpenAIProvider({
                apiKey: config.openaiKey,
                model: 'gpt-4o'
            })
        }

        if (config.anthropicKey) {
            this.anthropic = new AnthropicProvider({
                apiKey: config.anthropicKey,
                model: 'claude-3-7-sonnet'
            })
        }

        if (config.googleKey) {
            this.google = new GoogleAIProvider({
                apiKey: config.googleKey,
                model: 'gemini-2.0-flash'
            })
        }

        if (config.preferredProvider) {
            this.preferredProvider = config.preferredProvider

            // Update fallback order based on preference
            this.fallbackOrder = [
                config.preferredProvider,
                ...this.fallbackOrder.filter(p => p !== config.preferredProvider)
            ]
        }
    }

    /**
     * Generate content using the preferred provider with automatic fallback
     */
    async generate(request: AIRequest): Promise<AIResponse> {
        const errors: Record<string, string> = {}

        for (const provider of this.fallbackOrder) {
            try {
                const providerInstance = this.getProvider(provider)

                if (!providerInstance) {
                    errors[provider] = 'Provider not configured'
                    continue
                }

                const startTime = Date.now()
                const response = await providerInstance.generate(request)
                const duration = Date.now() - startTime

                // Log metrics (in production, send to analytics)
                this.logMetrics({
                    provider,
                    model: response.model,
                    tokensUsed: response.tokensUsed,
                    cost: response.cost || 0,
                    duration,
                    success: true
                })

                return response
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                errors[provider] = errorMessage

                // Log failed attempt
                this.logMetrics({
                    provider,
                    model: request.model || 'gpt-4o' as any,
                    tokensUsed: 0,
                    cost: 0,
                    duration: 0,
                    success: false,
                    error: errorMessage
                })

                // Continue to next provider in fallback order
                continue
            }
        }

        // If all providers failed
        throw new Error(
            `All AI providers failed. Errors: ${JSON.stringify(errors, null, 2)}`
        )
    }

    /**
     * Generate streaming content
     */
    async generateStream(request: AIRequest, provider?: AIProvider): Promise<ReadableStream> {
        const targetProvider = provider || this.preferredProvider
        const providerInstance = this.getProvider(targetProvider)

        if (!providerInstance) {
            throw new Error(`Provider ${targetProvider} is not configured`)
        }

        return providerInstance.generateStream(request)
    }

    /**
     * Get a specific provider instance
     */
    private getProvider(provider: AIProvider): OpenAIProvider | AnthropicProvider | GoogleAIProvider | null {
        switch (provider) {
            case 'openai':
                return this.openai
            case 'anthropic':
                return this.anthropic
            case 'google':
                return this.google
            default:
                return null
        }
    }

    /**
     * Log generation metrics
     */
    private logMetrics(metrics: AIGenerationMetrics) {
        // In production, send to analytics service
        console.log('[AI Metrics]', {
            ...metrics,
            timestamp: new Date().toISOString()
        })

        // TODO: Send to analytics service (Posthog, Mixpanel, etc.)
        // TODO: Store in database for cost tracking
    }

    /**
     * Get list of available providers
     */
    getAvailableProviders(): AIProvider[] {
        const available: AIProvider[] = []

        if (this.openai) available.push('openai')
        if (this.anthropic) available.push('anthropic')
        if (this.google) available.push('google')

        return available
    }

    /**
     * Check if a specific provider is available
     */
    isProviderAvailable(provider: AIProvider): boolean {
        return this.getProvider(provider) !== null
    }
}

/**
 * Create a singleton instance (server-side only)
 */
let orchestratorInstance: AIOrchestrator | null = null

export function getAIOrchestrator(): AIOrchestrator {
    if (!orchestratorInstance) {
        orchestratorInstance = new AIOrchestrator({
            openaiKey: process.env.OPENAI_API_KEY,
            anthropicKey: process.env.ANTHROPIC_API_KEY,
            googleKey: process.env.GOOGLE_AI_API_KEY,
            preferredProvider: (process.env.PREFERRED_AI_PROVIDER as AIProvider) || 'openai'
        })
    }

    return orchestratorInstance
}
