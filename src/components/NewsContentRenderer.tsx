import React from 'react';

interface NewsContentRendererProps {
  content: string;
  className?: string;
  isSummary?: boolean;
}

export const NewsContentRenderer: React.FC<NewsContentRendererProps> = ({
  content,
  className = '',
  isSummary = false,
}) => {
  if (!content) return null;

  // Detect HTML tags in content
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);

  if (hasHtml) {
    return (
      <div
        className={`news-html-render text-zelda-charcoal/90 text-sm leading-relaxed space-y-2
          [&_h1]:text-xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-zelda-gold [&_h1]:mt-3 [&_h1]:mb-1
          [&_h2]:text-lg [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-zelda-gold [&_h2]:mt-2.5 [&_h2]:mb-1
          [&_h3]:text-base [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-zelda-gold [&_h3]:mt-2 [&_h3]:mb-1
          [&_h4]:text-sm [&_h4]:font-serif [&_h4]:font-bold [&_h4]:text-zelda-charcoal [&_h4]:mt-1.5 [&_h4]:mb-1
          [&_p]:mb-2 [&_p:last-child]:mb-0
          [&_a]:text-zelda-gold [&_a]:underline [&_a]:hover:text-yellow-700 [&_a]:transition-colors
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1
          [&_li]:text-zelda-charcoal/85
          [&_blockquote]:border-l-4 [&_blockquote]:border-zelda-gold [&_blockquote]:bg-zelda-gold/5 [&_blockquote]:py-1.5 [&_blockquote]:px-3 [&_blockquote]:italic [&_blockquote]:rounded-r [&_blockquote]:my-2.5
          [&_strong]:font-bold [&_strong]:text-zelda-charcoal
          [&_b]:font-bold [&_b]:text-zelda-charcoal
          [&_em]:italic [&_i]:italic
          [&_code]:bg-black/5 [&_code]:text-zelda-charcoal [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs
          [&_pre]:bg-zinc-900 [&_pre]:text-amber-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:text-xs
          [&_img]:rounded-lg [&_img]:shadow-md [&_img]:max-w-full [&_img]:h-auto [&_img]:my-3 [&_img]:border [&_img]:border-zelda-border-sand
          [&_hr]:border-zelda-border-sand/60 [&_hr]:my-3
          ${isSummary ? 'line-clamp-3' : ''}
          ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Plain text fallback
  return (
    <div className={`text-zelda-charcoal/80 text-sm leading-relaxed whitespace-pre-wrap ${className}`}>
      {content}
    </div>
  );
};
