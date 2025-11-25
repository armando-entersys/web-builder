/**
 * AI Prompt Templates for Web Builder
 * Centralized prompts for various AI-powered features
 */

export const prompts = {
    /**
     * Generate sitemap structure from business description
     */
    generateSitemap: (description: string, industry?: string) => `
You are an expert web architect. Based on the following business description, generate a comprehensive sitemap structure.

Business Description:
${description}

${industry ? `Industry: ${industry}` : ''}

Generate a sitemap with:
1. Homepage (required)
2. Essential pages based on the business type
3. Clear page hierarchy
4. SEO-friendly URL slugs
5. Brief descriptions for each page

Return the response as a JSON array with this structure:
[
  {
    "label": "Page Name",
    "slug": "/url-path",
    "title": "Page Title",
    "description": "Brief page description",
    "metaTitle": "SEO meta title",
    "metaDescription": "SEO meta description",
    "isPublished": true,
    "children": ["child-page-id"] // optional
  }
]

Important:
- Use lowercase slugs with hyphens
- Keep meta titles under 60 characters
- Keep meta descriptions under 160 characters
- Include essential pages like About, Contact, etc.
- Consider the industry when suggesting pages
`.trim(),

    /**
     * Generate SEO-optimized content for a page
     */
    generatePageContent: (pageName: string, pageDescription: string, industry?: string) => `
You are an expert content strategist. Generate SEO-optimized content for the following page:

Page: ${pageName}
Description: ${pageDescription}
${industry ? `Industry: ${industry}` : ''}

Generate:
1. Compelling page title (H1)
2. Meta title (50-60 characters)
3. Meta description (150-160 characters)
4. Brief content outline (3-5 key sections)

Return as JSON:
{
  "title": "Main page title",
  "metaTitle": "SEO meta title",
  "metaDescription": "SEO meta description",
  "sections": [
    {
      "heading": "Section title",
      "content": "Brief description of what this section covers"
    }
  ]
}

Focus on:
- User intent
- Search engine optimization
- Clear value proposition
- Industry best practices
`.trim(),

    /**
     * Optimize existing page for SEO
     */
    optimizeSEO: (
        pageTitle: string,
        pageDescription: string,
        currentMetaTitle?: string,
        currentMetaDescription?: string
    ) => `
You are an SEO expert. Optimize the following page for search engines and conversational AI:

Current Information:
- Page Title: ${pageTitle}
- Description: ${pageDescription}
${currentMetaTitle ? `- Current Meta Title: ${currentMetaTitle}` : ''}
${currentMetaDescription ? `- Current Meta Description: ${currentMetaDescription}` : ''}

Provide optimized versions that:
1. Target relevant keywords
2. Are optimized for ChatGPT, Perplexity, and Claude searches
3. Follow SEO best practices
4. Are compelling and click-worthy

Return as JSON:
{
  "metaTitle": "Optimized meta title (50-60 chars)",
  "metaDescription": "Optimized meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"]
}
`.trim(),

    /**
     * Generate Schema.org markup suggestions
     */
    generateSchemaMarkup: (pageType: string, pageData: Record<string, any>) => `
You are a structured data expert. Generate appropriate Schema.org markup for this page:

Page Type: ${pageType}
Page Data: ${JSON.stringify(pageData, null, 2)}

Suggest the most relevant Schema.org types (e.g., WebPage, Article, Product, Organization, etc.) and provide a complete JSON-LD structure.

Return as JSON:
{
  "recommendedType": "Schema type name",
  "jsonLd": {
    "@context": "https://schema.org",
    "@type": "...",
    // ... complete schema markup
  },
  "explanation": "Why this schema type is recommended"
}
`.trim(),

    /**
     * Suggest related pages to add
     */
    suggestRelatedPages: (existingPages: string[], industry?: string) => `
You are a web architecture consultant. Based on these existing pages, suggest additional pages that would enhance the website:

Existing Pages:
${existingPages.map((page, i) => `${i + 1}. ${page}`).join('\n')}

${industry ? `Industry: ${industry}` : ''}

Suggest 3-5 additional pages that would be valuable. For each suggestion, explain:
1. Why it's important
2. What content it should contain
3. How it complements existing pages

Return as JSON array:
[
  {
    "label": "Page Name",
    "slug": "/suggested-path",
    "rationale": "Why this page is important",
    "priority": "high|medium|low"
  }
]
`.trim(),
}

/**
 * System message for the AI assistant
 */
export const systemMessage = `
You are an expert web architect and SEO specialist. You help users create optimal website structures and content that performs well in both traditional search engines and conversational AI platforms like ChatGPT, Perplexity, and Claude.

Your responses should be:
- Concise and actionable
- Based on current SEO and web design best practices
- Optimized for discoverability in AI-powered search
- Focused on user intent and business goals

Always return structured data in valid JSON format when requested.
`.trim()
