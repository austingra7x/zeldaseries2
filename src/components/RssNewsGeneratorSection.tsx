/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Rss, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Globe, 
  Award, 
  ShieldCheck, 
  RefreshCw, 
  Send, 
  Copy, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Layers,
  Edit3
} from 'lucide-react';
import { RssFeedItem, GeneratedSeoNews } from '../types';

interface RssNewsGeneratorSectionProps {
  onPublishNews: (newsData: any) => Promise<boolean>;
}

export const RssNewsGeneratorSection: React.FC<RssNewsGeneratorSectionProps> = ({ onPublishNews }) => {
  const [feedItems, setFeedItems] = useState<RssFeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [feedUrl, setFeedUrl] = useState<string>('https://news.google.com/rss/search?q=legend+of+zelda&hl=en-US&gl=US&ceid=US:en');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [selectedRssItem, setSelectedRssItem] = useState<RssFeedItem | null>(null);
  const [targetKeyword, setTargetKeyword] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedSeoNews | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const [publishing, setPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<'content' | 'seo' | 'schema' | 'eeat'>('content');

  // Fetch feed on component mount
  const fetchRssFeed = async () => {
    setLoadingFeed(true);
    setFeedError(null);
    try {
      const res = await fetch('/api/rss-news/feed');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response while fetching RSS feed. Please refresh in a moment.');
      }
      const data = await res.json();
      setFeedItems(data.items || []);
      setFeedUrl(data.feedUrl || feedUrl);
      setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : new Date().toLocaleTimeString());
      if (data.items && data.items.length > 0 && !selectedRssItem) {
        setSelectedRssItem(data.items[0]);
      }
    } catch (err: any) {
      console.error('Error fetching RSS:', err);
      setFeedError(err?.message || 'Could not connect to Google News RSS feed.');
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchRssFeed();
  }, []);

  const handleGenerateArticle = async () => {
    if (!selectedRssItem) return;
    setGenerating(true);
    setGenError(null);
    setPublishSuccess(null);

    try {
      const res = await fetch('/api/rss-news/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rssItem: selectedRssItem,
          targetKeyword: targetKeyword.trim() || undefined,
          customInstructions: customInstructions.trim() || undefined
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate article');
      }

      const data: GeneratedSeoNews = await res.json();
      setGeneratedArticle(data);
      setActiveViewTab('content');
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenError(err?.message || 'Failed to generate SEO article with Gemini.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedArticle) return;
    setPublishing(true);
    setPublishSuccess(null);

    try {
      const success = await onPublishNews({
        title: generatedArticle.title,
        summary: generatedArticle.summary,
        content: generatedArticle.contentHtml,
        category: generatedArticle.category,
        imageUrl: generatedArticle.imageUrl,
        galleryImages: generatedArticle.galleryImages,
        seoTitle: generatedArticle.seoTitle,
        metaDescription: generatedArticle.metaDescription,
        focusKeywords: generatedArticle.focusKeywords,
        canonicalUrl: generatedArticle.canonicalUrl,
        jsonLdSchema: generatedArticle.jsonLdSchema,
        authorByline: generatedArticle.authorByline,
        eeatDetails: generatedArticle.eeatDetails,
        rssReferenceUrl: generatedArticle.rssReferenceUrl,
        rssSourceTitle: generatedArticle.rssSourceTitle,
        rssPublishDate: generatedArticle.rssPublishDate
      });

      if (success) {
        setPublishSuccess(`Successfully published "${generatedArticle.title}" to the live News feed!`);
      } else {
        throw new Error('Failed to publish story to database');
      }
    } catch (err: any) {
      setGenError(err?.message || 'Publication failed.');
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-8 text-zelda-charcoal">
      {/* SECTION HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#1b2a22] to-[#2c3d31] border-2 border-zelda-gold rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Rss className="w-48 h-48 text-zelda-gold" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-zelda-gold/20 text-zelda-gold border border-zelda-gold/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Google News Engine
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                E-E-A-T & On-Page SEO Compliant
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-extrabold text-[#F4EFE1] uppercase tracking-wide">
              Real-Time News Generator Sanctum
            </h2>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Harvest real-time Legend of Zelda RSS entries directly from Google News, then invoke Gemini AI to transform them into fully optimized, E-E-A-T compliant news stories complete with meta tags, schema markup, and editorial credentials.
            </p>
          </div>

          <div className="bg-black/40 border border-zelda-gold/30 rounded-xl p-3 text-right flex flex-col justify-center min-w-[200px]">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Reference Source Feed</span>
            <span className="text-xs font-serif text-zelda-gold truncate font-bold block max-w-[220px]">
              Google News (Zelda)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5">
              Updated: {lastUpdated || 'Just now'}
            </span>
          </div>
        </div>
      </div>

      {/* FEED CONTROLS & LIVE RSS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT 5 COLS: RSS FEED ITEM SELECTOR */}
        <div className="lg:col-span-5 bg-white border border-zelda-border-sand rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zelda-border-sand/60 pb-3">
              <div className="flex items-center gap-2">
                <Rss className="w-4 h-4 text-zelda-gold" />
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-zelda-charcoal">
                  Live RSS Feed Items
                </h3>
              </div>

              <button
                onClick={fetchRssFeed}
                disabled={loadingFeed}
                className="p-1.5 hover:bg-zelda-gold/10 text-zelda-gold hover:text-zelda-gold-dark rounded transition-colors flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer"
                title="Refresh RSS Feed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingFeed ? 'animate-spin' : ''}`} />
                <span>{loadingFeed ? 'Fetching...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Reference RSS URL bar */}
            <div className="bg-zelda-beige-card/70 border border-zelda-border-sand/60 rounded-lg p-2 flex items-center justify-between text-[11px] gap-2">
              <div className="flex items-center gap-1.5 overflow-hidden text-zelda-charcoal/80 font-mono truncate">
                <Globe className="w-3.5 h-3.5 text-zelda-gold flex-shrink-0" />
                <span className="truncate">{feedUrl}</span>
              </div>
              <a
                href={feedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zelda-gold hover:underline flex-shrink-0 p-1"
                title="Open RSS Feed URL"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {feedError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{feedError}</span>
              </div>
            )}

            {/* FEED ITEMS LIST */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {feedItems.length === 0 && !loadingFeed && (
                <div className="p-8 text-center text-xs italic text-gray-500">
                  No RSS items available. Click Refresh to query Google News.
                </div>
              )}

              {feedItems.map((item) => {
                const isSelected = selectedRssItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRssItem(item)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zelda-gold/10 border-zelda-gold shadow-sm ring-1 ring-zelda-gold'
                        : 'bg-white hover:bg-zelda-beige-card/50 border-zelda-border-sand hover:border-zelda-gold/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="bg-zelda-gold/20 text-zelda-gold text-[9px] font-serif font-bold uppercase px-2 py-0.5 rounded border border-zelda-gold/30">
                        {item.source || 'News Source'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <h4 className={`font-serif text-xs font-bold leading-snug ${isSelected ? 'text-zelda-gold-dark' : 'text-zelda-charcoal'}`}>
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-zelda-charcoal/70 line-clamp-2 mt-1 leading-normal">
                      {item.snippet}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EDITORIAL CUSTOMIZATION FORM */}
          <div className="bg-zelda-beige-card/60 border border-zelda-border-sand rounded-xl p-4 space-y-3 mt-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-zelda-gold flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              SEO & Tone Parameters
            </h4>

            <div>
              <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                Target Primary SEO Keyword (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Legend of Zelda movie release date, Switch 2 Zelda"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-serif uppercase tracking-wider text-zelda-charcoal/80 mb-1">
                Custom Directives / Angles (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Emphasize impact on Tears of the Kingdom fans and developer quotes..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="w-full bg-white border border-zelda-border-sand rounded p-2 text-xs text-zelda-charcoal focus:outline-none focus:border-zelda-gold"
              />
            </div>

            <button
              onClick={handleGenerateArticle}
              disabled={generating || !selectedRssItem}
              className="w-full py-3 bg-zelda-gold hover:bg-yellow-600 disabled:bg-gray-400 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Authoring E-E-A-T & SEO Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Real-Time SEO News Entry</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT 7 COLS: GENERATED ARTICLE & SEO / E-E-A-T AUDIT WORKSPACE */}
        <div className="lg:col-span-7 space-y-6">
          {!generatedArticle && !generating && (
            <div className="h-full min-h-[450px] border-2 border-dashed border-zelda-border-sand bg-white/40 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-zelda-gold/15 border border-zelda-gold/30 rounded-full flex items-center justify-center text-zelda-gold">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-base font-bold text-zelda-charcoal uppercase tracking-wider">
                  Select an RSS Entry & Generate
                </h3>
                <p className="text-xs text-zelda-charcoal/70 max-w-md leading-relaxed">
                  Choose any live feed item on the left panel to trigger Gemini AI. The generator will produce a complete news story with On-Page SEO meta tags, schema markup, and an E-E-A-T compliance audit.
                </p>
              </div>
            </div>
          )}

          {generating && (
            <div className="h-full min-h-[450px] border border-zelda-border-sand bg-white/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-zelda-gold/25 border-t-zelda-gold rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-zelda-gold absolute animate-pulse" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-zelda-gold font-bold text-base uppercase tracking-wider animate-pulse">
                  Synthesizing E-E-A-T News Chronicle
                </h4>
                <p className="text-xs text-zelda-charcoal/80 max-w-md italic">
                  Parsing reference feed snippet, establishing expert authoritativeness, writing structured HTML, and constructing JSON-LD news schema...
                </p>
              </div>

              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                Powered by Gemini 3.5 Flash &bull; Google Search Guidelines Engine
              </div>
            </div>
          )}

          {genError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{genError}</span>
            </div>
          )}

          {publishSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl p-4 text-xs flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="font-bold">{publishSuccess}</span>
              </div>
              <a
                href="#news"
                className="text-emerald-700 hover:underline font-serif uppercase tracking-wider font-bold text-[11px] whitespace-nowrap"
              >
                View Live Feed &rarr;
              </a>
            </div>
          )}

          {/* GENERATED CONTENT WORKSPACE TABS */}
          {generatedArticle && !generating && (
            <div className="bg-white border border-zelda-border-sand rounded-2xl overflow-hidden shadow-lg space-y-0">
              
              {/* TOP WORKSPACE NAVIGATION BAR */}
              <div className="bg-zelda-beige-card/90 border-b border-zelda-border-sand p-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setActiveViewTab('content')}
                    className={`px-3 py-1.5 rounded-lg font-serif text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeViewTab === 'content'
                        ? 'bg-zelda-gold text-white shadow'
                        : 'bg-white hover:bg-white/80 text-zelda-charcoal/70 border border-zelda-border-sand'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Article Preview</span>
                  </button>

                  <button
                    onClick={() => setActiveViewTab('seo')}
                    className={`px-3 py-1.5 rounded-lg font-serif text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeViewTab === 'seo'
                        ? 'bg-zelda-gold text-white shadow'
                        : 'bg-white hover:bg-white/80 text-zelda-charcoal/70 border border-zelda-border-sand'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>On-Page SEO Tags</span>
                  </button>

                  <button
                    onClick={() => setActiveViewTab('eeat')}
                    className={`px-3 py-1.5 rounded-lg font-serif text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeViewTab === 'eeat'
                        ? 'bg-zelda-gold text-white shadow'
                        : 'bg-white hover:bg-white/80 text-zelda-charcoal/70 border border-zelda-border-sand'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>E-E-A-T Score ({generatedArticle.eeatDetails.score}/100)</span>
                  </button>

                  <button
                    onClick={() => setActiveViewTab('schema')}
                    className={`px-3 py-1.5 rounded-lg font-serif text-xs uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeViewTab === 'schema'
                        ? 'bg-zelda-gold text-white shadow'
                        : 'bg-white hover:bg-white/80 text-zelda-charcoal/70 border border-zelda-border-sand'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>JSON-LD Schema</span>
                  </button>
                </div>

                {/* PUBLISH ACTION BUTTON */}
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {publishing ? (
                    <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Publish Story</span>
                </button>
              </div>

              {/* TAB 1: ARTICLE PREVIEW & EDITING */}
              {activeViewTab === 'content' && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between text-xs border-b border-zelda-border-sand/40 pb-3">
                    <span className="font-serif font-bold text-zelda-gold uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-4 h-4" /> By {generatedArticle.authorByline}
                    </span>
                    <span className="bg-zelda-gold/15 text-zelda-gold font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-zelda-gold/30">
                      Category: {generatedArticle.category}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-extrabold text-zelda-charcoal leading-snug">
                      {generatedArticle.title}
                    </h3>
                    <p className="text-xs text-zelda-charcoal/80 italic bg-zelda-beige-card p-3 rounded-lg border border-zelda-border-sand/50">
                      "{generatedArticle.summary}"
                    </p>
                  </div>

                  {/* Main Image */}
                  {generatedArticle.imageUrl && (
                    <div className="relative h-56 rounded-xl overflow-hidden border border-zelda-border-sand shadow-inner">
                      <img
                        src={generatedArticle.imageUrl}
                        alt={generatedArticle.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        Source Ref: {generatedArticle.rssSourceTitle}
                      </div>
                    </div>
                  )}

                  {/* HTML Content Body */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-zelda-gold border-b border-zelda-border-sand/40 pb-1">
                      Formatted Article Content
                    </h4>
                    <div 
                      className="prose prose-sm max-w-none text-xs text-zelda-charcoal/90 leading-relaxed space-y-3 font-sans"
                      dangerouslySetInnerHTML={{ __html: generatedArticle.contentHtml }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ON-PAGE SEO METADATA TAGS */}
              {activeViewTab === 'seo' && (
                <div className="p-6 space-y-5">
                  <div className="border-b border-zelda-border-sand/50 pb-2">
                    <h4 className="font-serif text-sm font-bold text-zelda-gold uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      Google Search Meta Tag Audit
                    </h4>
                    <p className="text-xs text-zelda-charcoal/70">
                      On-page SEO elements formatted according to Google Search Snippet guidelines.
                    </p>
                  </div>

                  {/* SEO Title Tag */}
                  <div className="space-y-1.5 bg-zelda-beige-card/50 p-4 rounded-xl border border-zelda-border-sand">
                    <div className="flex items-center justify-between text-xs font-serif font-bold text-zelda-charcoal">
                      <span>SEO &lt;title&gt; Tag</span>
                      <span className={`text-[10px] font-mono ${generatedArticle.seoTitle.length <= 60 ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>
                        {generatedArticle.seoTitle.length} / 60 Characters
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-zelda-border-sand font-mono text-xs text-blue-700 font-semibold truncate">
                      {generatedArticle.seoTitle}
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-1.5 bg-zelda-beige-card/50 p-4 rounded-xl border border-zelda-border-sand">
                    <div className="flex items-center justify-between text-xs font-serif font-bold text-zelda-charcoal">
                      <span>Meta &lt;meta name="description"&gt;</span>
                      <span className={`text-[10px] font-mono ${generatedArticle.metaDescription.length <= 160 ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>
                        {generatedArticle.metaDescription.length} / 160 Characters
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-zelda-border-sand font-mono text-xs text-gray-800 leading-relaxed">
                      {generatedArticle.metaDescription}
                    </div>
                  </div>

                  {/* Focus Keywords */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-serif font-bold text-zelda-charcoal uppercase tracking-wider block">
                      Target Focus Keywords & LSI Terms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedArticle.focusKeywords.map((kw, idx) => (
                        <span key={idx} className="bg-zelda-gold/15 text-zelda-gold font-mono text-[11px] px-2.5 py-1 rounded-full border border-zelda-gold/30 font-semibold">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-1">
                    <span className="text-xs font-serif font-bold text-zelda-charcoal uppercase tracking-wider block">
                      Canonical Link Element
                    </span>
                    <div className="bg-white p-2 rounded border border-zelda-border-sand font-mono text-xs text-gray-600">
                      &lt;link rel="canonical" href="{generatedArticle.canonicalUrl}" /&gt;
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: E-E-A-T AUDIT SCORECARD */}
              {activeViewTab === 'eeat' && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-zelda-border-sand/50 pb-3">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-zelda-gold uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Google E-E-A-T Quality Assessment
                      </h4>
                      <p className="text-xs text-zelda-charcoal/70">
                        Experience, Expertise, Authoritativeness, and Trustworthiness metrics.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-1.5">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-emerald-700 block uppercase font-bold">E-E-A-T Score</span>
                        <span className="text-base font-serif font-black text-emerald-800">
                          {generatedArticle.eeatDetails.score} / 100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Expertise Notes */}
                    <div className="bg-zelda-beige-card/50 p-4 rounded-xl border border-zelda-border-sand space-y-1.5">
                      <span className="text-xs font-serif font-bold text-zelda-gold uppercase tracking-wider block">
                        🎓 Expertise & Experience Validation
                      </span>
                      <p className="text-xs text-zelda-charcoal/80 leading-relaxed">
                        {generatedArticle.eeatDetails.expertiseNotes}
                      </p>
                    </div>

                    {/* Fact Check Status */}
                    <div className="bg-zelda-beige-card/50 p-4 rounded-xl border border-zelda-border-sand space-y-1.5">
                      <span className="text-xs font-serif font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fact Verification Status
                      </span>
                      <p className="text-xs text-zelda-charcoal/80 leading-relaxed">
                        {generatedArticle.eeatDetails.factCheckStatus}
                      </p>
                    </div>
                  </div>

                  {/* Cited Sources */}
                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-zelda-border-sand">
                    <span className="text-xs font-serif font-bold text-zelda-charcoal uppercase tracking-wider block">
                      🔗 Transparent Citation Sources
                    </span>
                    <ul className="list-disc list-inside text-xs text-zelda-charcoal/80 space-y-1 font-mono">
                      {generatedArticle.eeatDetails.citationSources.map((src, idx) => (
                        <li key={idx}>{src}</li>
                      ))}
                      <li>Original Reference Feed: {generatedArticle.rssSourceTitle} ({generatedArticle.rssPublishDate})</li>
                    </ul>
                  </div>

                  {/* Editorial Disclosure */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed italic">
                    <strong>Editorial Disclosure:</strong> {generatedArticle.eeatDetails.editorialDisclosure}
                  </div>
                </div>
              )}

              {/* TAB 4: JSON-LD SCHEMA MARKUP */}
              {activeViewTab === 'schema' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-zelda-border-sand/50 pb-2">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-zelda-gold uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-4 h-4" />
                        schema.org/NewsArticle JSON-LD
                      </h4>
                      <p className="text-xs text-zelda-charcoal/70">
                        Structured data string for Google News indexation and rich search cards.
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(generatedArticle.jsonLdSchema)}
                      className="px-3 py-1.5 bg-zelda-beige-card hover:bg-zelda-gold/20 border border-zelda-border-sand rounded-lg text-xs font-serif uppercase font-bold text-zelda-gold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSchema ? 'Copied!' : 'Copy Schema'}</span>
                    </button>
                  </div>

                  <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-80 leading-relaxed border border-gray-800">
                    {generatedArticle.jsonLdSchema}
                  </pre>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
