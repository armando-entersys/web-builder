import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAIOrchestrator } from '@repo/ai'
import { prompts } from '@repo/ai'

/**
 * POST /api/ai/generate
 * Generate AI content using the orchestrator
 */
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { type, data } = body

        if (!type) {
            return NextResponse.json(
                { error: 'Type is required' },
                { status: 400 }
            )
        }

        const orchestrator = getAIOrchestrator()

        // Generate appropriate prompt based on type
        let prompt = ''
        let systemMessage = prompts.systemMessage

        switch (type) {
            case 'sitemap':
                if (!data.description) {
                    return NextResponse.json(
                        { error: 'Description is required for sitemap generation' },
                        { status: 400 }
                    )
                }
                prompt = prompts.generateSitemap(data.description, data.industry)
                break

            case 'page-content':
                if (!data.pageName) {
                    return NextResponse.json(
                        { error: 'Page name is required' },
                        { status: 400 }
                    )
                }
                prompt = prompts.generatePageContent(
                    data.pageName,
                    data.pageDescription || '',
                    data.industry
                )
                break

            case 'seo-optimize':
                if (!data.pageTitle) {
                    return NextResponse.json(
                        { error: 'Page title is required' },
                        { status: 400 }
                    )
                }
                prompt = prompts.optimizeSEO(
                    data.pageTitle,
                    data.pageDescription || '',
                    data.metaTitle,
                    data.metaDescription
                )
                break

            case 'schema-markup':
                if (!data.pageType) {
                    return NextResponse.json(
                        { error: 'Page type is required' },
                        { status: 400 }
                    )
                }
                prompt = prompts.generateSchemaMarkup(data.pageType, data.pageData || {})
                break

            case 'suggest-pages':
                if (!data.existingPages || !Array.isArray(data.existingPages)) {
                    return NextResponse.json(
                        { error: 'Existing pages array is required' },
                        { status: 400 }
                    )
                }
                prompt = prompts.suggestRelatedPages(data.existingPages, data.industry)
                break

            default:
                return NextResponse.json(
                    { error: `Unknown type: ${type}` },
                    { status: 400 }
                )
        }

        // Generate with orchestrator
        const response = await orchestrator.generate({
            prompt,
            systemMessage,
            temperature: 0.7,
            maxTokens: 2000
        })

        // Parse JSON response if applicable
        let parsedContent = response.content

        try {
            // Try to extract JSON from markdown code blocks if present
            const jsonMatch = response.content.match(/```json\n?([\s\S]*?)\n?```/)
            if (jsonMatch) {
                parsedContent = JSON.parse(jsonMatch[1])
            } else {
                // Try to parse directly
                parsedContent = JSON.parse(response.content)
            }
        } catch (e) {
            // If parsing fails, return as-is
            // This is fine for some prompts that return text
        }

        return NextResponse.json({
            success: true,
            content: parsedContent,
            metadata: {
                provider: response.provider,
                model: response.model,
                tokensUsed: response.tokensUsed,
                cost: response.cost
            }
        })

    } catch (error) {
        console.error('AI Generation Error:', error)

        return NextResponse.json(
            {
                error: 'Failed to generate content',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
