import React from 'react';

interface CreationContentRendererProps {
  content?: string;
  className?: string;
}

export const CreationContentRenderer: React.FC<CreationContentRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Check if string contains HTML tags
  const containsHtml = /<[a-z][\s\S]*>/i.test(content);

  if (containsHtml) {
    return (
      <div
        className={`prose prose-amber max-w-none font-serif text-zelda-charcoal/90 leading-relaxed 
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-zelda-charcoal [&_h1]:mb-3 [&_h1]:mt-4
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zelda-charcoal [&_h2]:mb-2 [&_h2]:mt-4
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-zelda-gold [&_h3]:mb-2 [&_h3]:mt-3
          [&_p]:mb-3 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
          [&_li]:mb-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-zelda-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:bg-amber-50/60 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg
          [&_a]:text-zelda-gold [&_a]:underline [&_a]:font-bold hover:[&_a]:text-yellow-600
          [&_img]:rounded-xl [&_img]:max-h-96 [&_img]:w-auto [&_img]:my-3 [&_img]:shadow-md
          [&_code]:bg-black/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-amber-900
          [&_mark]:bg-amber-200/80 [&_mark]:px-1 [&_mark]:rounded
          ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={`font-serif text-zelda-charcoal/90 leading-relaxed whitespace-pre-wrap ${className}`}>
      {content}
    </div>
  );
};
