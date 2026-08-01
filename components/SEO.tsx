import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    jsonLd?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ 
    title = 'ArtisanFlow - AI Business Operating System', 
    description = 'The ultimate AI-powered ecosystem for makers. Outperform Craftybase with generative marketing, predictive Profit Guard, and unthrottled scaling.',
    jsonLd 
}) => {
    useEffect(() => {
        document.title = title;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);

        // Inject JSON-LD if provided
        if (jsonLd) {
            let script = document.querySelector('script[type="application/ld+json"]');
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(jsonLd);
        }

        return () => {
            // Cleanup on unmount if needed, though for an SPA keeping it is fine.
        };
    }, [title, description, jsonLd]);

    return null;
};
