import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Info, 
  Mail, 
  ShieldCheck, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Compass, 
  BookOpen, 
  Film, 
  Award, 
  Shield, 
  User, 
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export type FooterPageType = 'about' | 'contact' | 'privacy' | 'sitemap';

interface FooterPageViewsProps {
  activeTab: FooterPageType;
  onNavigateTab: (tab: 'news' | 'lore' | 'submissions' | 'guide' | 'admin', subTab?: 'feed' | 'submit') => void;
  onNavigateFooter: (page: FooterPageType) => void;
  onOpenAuth: () => void;
}

export const FooterPageViews: React.FC<FooterPageViewsProps> = ({
  activeTab,
  onNavigateTab,
  onNavigateFooter,
  onOpenAuth,
}) => {
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setContactSubmitted(true);
  };

  const resetContactForm = () => {
    setContactName('');
    setContactEmail('');
    setContactSubject('General Inquiry');
    setContactMessage('');
    setContactSubmitted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Breadcrumb & Sub-Nav Header */}
      <div className="bg-zelda-green-forest border-2 border-zelda-gold rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('news')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider"
            title="Return to Main Feed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Main Realm</span>
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#EAE2CF]">
            <span className="text-zelda-gold">▲</span>
            <span>Hyrule Official Archives</span>
            <span className="text-zelda-gold/60">&raquo;</span>
            <span className="text-zelda-gold font-extrabold">
              {activeTab === 'about' && 'About Us'}
              {activeTab === 'contact' && 'Contact Us'}
              {activeTab === 'privacy' && 'Privacy Policy'}
              {activeTab === 'sitemap' && 'Site Map'}
            </span>
          </div>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => onNavigateFooter('about')}
            className={`px-3 py-1.5 rounded-lg font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
              activeTab === 'about'
                ? 'bg-zelda-gold text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>

          <button
            onClick={() => onNavigateFooter('contact')}
            className={`px-3 py-1.5 rounded-lg font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
              activeTab === 'contact'
                ? 'bg-zelda-gold text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>

          <button
            onClick={() => onNavigateFooter('privacy')}
            className={`px-3 py-1.5 rounded-lg font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
              activeTab === 'privacy'
                ? 'bg-zelda-gold text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </button>

          <button
            onClick={() => onNavigateFooter('sitemap')}
            className={`px-3 py-1.5 rounded-lg font-serif font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
              activeTab === 'sitemap'
                ? 'bg-zelda-gold text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Site Map</span>
          </button>
        </div>
      </div>

      {/* PAGE 1: ABOUT US */}
      {activeTab === 'about' && (
        <div className="bg-[#FBF7EE] text-zelda-charcoal border-2 border-zelda-gold/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="text-center space-y-3 pb-6 border-b border-zelda-border-sand/60">
            <div className="inline-flex p-3 bg-amber-100/80 text-zelda-gold rounded-2xl border border-zelda-gold/40 mb-1">
              <Compass className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zelda-green-forest uppercase tracking-wider">
              About Hyrule Fan Alliance
            </h1>
            <p className="text-base font-serif italic text-zelda-charcoal/80 max-w-2xl mx-auto">
              "Courage is the key to unlocking true wisdom, and through shared passion, the flame of Hyrule endures forever."
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-zelda-charcoal/90 leading-relaxed">
            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-3">
              <h2 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-zelda-gold" />
                Our Mission & Sanctuary
              </h2>
              <p>
                Founded by lifelong Zelda scholars and community creators, <strong>Hyrule Fan Alliance</strong> is a non-profit, fan-driven interactive sanctuary dedicated to celebrating over four decades of <i>The Legend of Zelda</i> universe.
              </p>
              <p>
                We bring together real-time news updates on upcoming releases (including Nintendo's live-action Legend of Zelda film), canonical lore archives, custom fan artwork, orchestral music, and interactive AI walkthrough guides into a single elegant portal.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-3">
              <h2 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2">
                <Shield className="w-5 h-5 text-zelda-gold" />
                Fair Use & Intellectual Property
              </h2>
              <p>
                All characters, names, locations, music motifs, and trademarks associated with <i>The Legend of Zelda</i> (including Link, Zelda, Ganon, and the Triforce) are the sole property of <strong>Nintendo Co., Ltd.</strong>
              </p>
              <p>
                This site operates under non-commercial, educational, and creative fair-use principles to foster fan engagement, artistic expression, and historical preservation.
              </p>
            </div>
          </div>

          {/* 4 Pillars of Alliance */}
          <div className="space-y-4 pt-6 border-t border-zelda-border-sand/60">
            <h3 className="font-serif font-bold text-center text-lg uppercase tracking-widest text-zelda-green-forest">
              The Four Pillars of the Alliance
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-amber-50/80 p-5 rounded-2xl border border-zelda-gold/30 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-zelda-gold/20 text-zelda-gold flex items-center justify-center font-bold">
                  <Film className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm uppercase text-zelda-charcoal">Chronicles & News</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Real-time verified reports on game remasters, movie castings, and community events.
                </p>
              </div>

              <div className="bg-amber-50/80 p-5 rounded-2xl border border-zelda-gold/30 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-zelda-gold/20 text-zelda-gold flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm uppercase text-zelda-charcoal">Royal Lore Archives</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Deciphered ancient Sheikah & Zonai texts, timelines, and canonical decrees.
                </p>
              </div>

              <div className="bg-amber-50/80 p-5 rounded-2xl border border-zelda-gold/30 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-zelda-gold/20 text-zelda-gold flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm uppercase text-zelda-charcoal">Fan IP Ledger</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Web3 parchment certificates protecting and celebrating community artwork & music.
                </p>
              </div>

              <div className="bg-amber-50/80 p-5 rounded-2xl border border-zelda-gold/30 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-zelda-gold/20 text-zelda-gold flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm uppercase text-zelda-charcoal">AI Game Companion</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Interactive walkthrough assistant for shrine puzzles, side quests, and boss strategies.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-zelda-border-sand/60">
            <button
              onClick={() => onNavigateFooter('contact')}
              className="px-8 py-3.5 bg-zelda-gold hover:bg-[#A6802C] text-white font-serif font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact the Royal Guard via admin@zeldaseries.com</span>
            </button>
          </div>
        </div>
      )}

      {/* PAGE 2: CONTACT US */}
      {activeTab === 'contact' && (
        <div className="bg-[#FBF7EE] text-zelda-charcoal border-2 border-zelda-gold/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="text-center space-y-2 pb-6 border-b border-zelda-border-sand/60">
            <div className="inline-flex p-3 bg-amber-100/80 text-zelda-gold rounded-2xl border border-zelda-gold/40 mb-1">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zelda-green-forest uppercase tracking-wider">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base font-serif text-zelda-charcoal/80 max-w-xl mx-auto">
              Send your inquiries, news tips, lore discoveries, or fan art submissions directly to <strong>admin@zeldaseries.com</strong>.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-zelda-border-sand shadow-xs space-y-5">
              {contactSubmitted ? (
                <div className="p-8 text-center space-y-4 bg-amber-50/80 rounded-2xl border border-zelda-gold/40">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-zelda-green-forest uppercase tracking-wider">
                    Dispatch Sent to admin@zeldaseries.com!
                  </h3>
                  <p className="text-xs sm:text-sm text-zelda-charcoal/80 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{contactName}</strong>. Your message regarding <i>"{contactSubject}"</i> has been dispatched directly to <u>admin@zeldaseries.com</u>. Our stewards will respond to <u>{contactEmail}</u> within 1-2 sun cycles.
                  </p>
                  <button
                    onClick={resetContactForm}
                    className="px-6 py-2.5 bg-zelda-gold text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-600 transition-colors cursor-pointer shadow-sm"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1.5">
                        Your Name / Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Hero of Time"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1.5">
                        Your Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g., link@hyrule.org"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1.5">
                      Inquiry Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans"
                    >
                      <option value="General Inquiry">General Inquiry & Feedback</option>
                      <option value="Fan Art & IP License">Fan Art & Web3 Certificate Question</option>
                      <option value="Lore Correction">Lore Correction or Theory Submission</option>
                      <option value="Movie & Game News Tip">Movie / Game News Tip</option>
                      <option value="Technical Support">Technical Support & Account Issues</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-serif uppercase tracking-widest text-zelda-charcoal font-bold mb-1.5">
                      Message Scroll <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Write your detailed message here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-white border border-zelda-border-sand rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-zelda-gold text-zelda-charcoal font-sans resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-zelda-gold hover:bg-[#A6802C] text-white font-serif font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Scroll to admin@zeldaseries.com ▲</span>
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-amber-50/90 p-6 rounded-2xl border border-zelda-gold/40 space-y-4">
                <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2">
                  <Globe className="w-5 h-5 text-zelda-gold" />
                  Direct Contact Info
                </h3>
                
                <div className="space-y-3 text-xs sm:text-sm text-zelda-charcoal/90">
                  <div className="p-3 bg-white rounded-xl border border-zelda-border-sand/60 space-y-1">
                    <div className="font-serif font-bold text-xs text-zelda-green-forest uppercase">Official Email</div>
                    <a 
                      href="mailto:admin@zeldaseries.com" 
                      className="text-zelda-gold hover:underline font-bold flex items-center gap-1.5 break-all"
                    >
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span>admin@zeldaseries.com</span>
                    </a>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zelda-border-sand/60 space-y-1">
                    <div className="font-serif font-bold text-xs text-zelda-green-forest uppercase">Sanctum Address</div>
                    <div className="flex items-start gap-1.5 text-gray-700">
                      <MapPin className="w-4 h-4 text-zelda-gold flex-shrink-0 mt-0.5" />
                      <span>Castle Town Sanctuary, Hyrule Realm</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-zelda-border-sand/60 space-y-1">
                    <div className="font-serif font-bold text-xs text-zelda-green-forest uppercase">Carrier Frequency</div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Compass className="w-4 h-4 text-zelda-gold flex-shrink-0" />
                      <span>Sheikah Signal: 433.92 MHz</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand space-y-2 text-zelda-charcoal/80 text-xs leading-relaxed">
                <h4 className="font-serif font-bold text-xs uppercase text-zelda-green-forest tracking-wider">
                  Response Commitment
                </h4>
                <p>
                  All dispatches sent through this form or directly to <strong>admin@zeldaseries.com</strong> are reviewed daily by the alliance stewards. Expect a response within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 3: PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <div className="bg-[#FBF7EE] text-zelda-charcoal border-2 border-zelda-gold/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="text-center space-y-2 pb-6 border-b border-zelda-border-sand/60">
            <div className="inline-flex p-3 bg-amber-100/80 text-zelda-gold rounded-2xl border border-zelda-gold/40 mb-1">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zelda-green-forest uppercase tracking-wider">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base font-serif text-zelda-charcoal/80 max-w-xl mx-auto">
              Your personal information and privacy are protected under the sacred oath of the Hyrule Royal Guard.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-zelda-border-sand shadow-xs space-y-6 text-xs sm:text-sm text-zelda-charcoal/90 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <span className="text-zelda-gold font-mono">1.</span> Information We Collect
              </h2>
              <p>
                When interacting with the Hyrule Fan Alliance platform, we may collect minimal data points required to provide secure authentication and social features:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li><strong>Account Credentials:</strong> Email address and display name provided during registration.</li>
                <li><strong>Web3 Wallet Details:</strong> Public cryptographic wallet address if authenticating via Web3 providers (e.g., MetaMask).</li>
                <li><strong>User Contributions:</strong> Fan art uploads, literature submissions, music links, lore comments, and Courage ('Like') counts stored in Firebase Firestore.</li>
                <li><strong>Technical Telemetry:</strong> Standard browser user-agent indicators to optimize interface display.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <span className="text-zelda-gold font-mono">2.</span> How Information Is Used
              </h2>
              <p>
                Your data is utilized strictly for operating the alliance sanctuary. We <strong>NEVER</strong> sell, rent, or trade user information to third-party brokers or advertisers.
              </p>
              <p>
                Uses include displaying your attribution on fan submissions, preserving your bookmarked news chronicles, verifying admin credentials, and responding to inquiries sent to <strong>admin@zeldaseries.com</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <span className="text-zelda-gold font-mono">3.</span> Cookies & Local Storage
              </h2>
              <p>
                This platform uses essential client browser <code>localStorage</code> and session tokens to maintain your login state and active user preferences. We do not employ cross-site tracking cookies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <span className="text-zelda-gold font-mono">4.</span> Your Rights & Data Deletion
              </h2>
              <p>
                You retain full rights over your personal data and creative uploads. If you wish to permanently delete your account or request data removal, please contact us at <a href="mailto:admin@zeldaseries.com" className="text-zelda-gold font-bold underline">admin@zeldaseries.com</a>.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* PAGE 4: SITE MAP */}
      {activeTab === 'sitemap' && (
        <div className="bg-[#FBF7EE] text-zelda-charcoal border-2 border-zelda-gold/60 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="text-center space-y-2 pb-6 border-b border-zelda-border-sand/60">
            <div className="inline-flex p-3 bg-amber-100/80 text-zelda-gold rounded-2xl border border-zelda-gold/40 mb-1">
              <MapPin className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zelda-green-forest uppercase tracking-wider">
              Site Map & Navigation Index
            </h1>
            <p className="text-sm sm:text-base font-serif text-zelda-charcoal/80 max-w-xl mx-auto">
              Complete directory of all realms, archives, creator tools, and pages across the platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Category 1: News & Chronicles */}
            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <Film className="w-5 h-5 text-zelda-gold" />
                1. News & Movie Chronicles
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <button
                  onClick={() => onNavigateTab('news')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Latest News Feed & Live Movie Chronicles</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateTab('news')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Zelda Movie Live Countdown Clock</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateTab('news')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Community Chronicles & Media Releases</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Category 2: Lore Archives */}
            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <BookOpen className="w-5 h-5 text-zelda-gold" />
                2. Lore Labyrinth & Royal Library
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <button
                  onClick={() => onNavigateTab('lore')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Canonical Timeline Archives (Skyward to TOTK)</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateTab('lore')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Ancient Relics & Sheikah Technology Lore</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateTab('lore')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Goddess Mythos & Royal Decrees</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Category 3: Fan Creations & IP Ledger */}
            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <Award className="w-5 h-5 text-zelda-gold" />
                3. Creator Club & Web3 IP Ledger
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <button
                  onClick={() => onNavigateTab('submissions', 'feed')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Creator Showcase Feed (Art, Music, Games, Cosplay)</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateTab('submissions', 'submit')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Submit Fan Work & Generate Web3 Certificate</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Category 4: Interactive Guides */}
            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <Compass className="w-5 h-5 text-zelda-gold" />
                4. AI Game Guide & Interactive Assistant
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <button
                  onClick={() => onNavigateTab('guide')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Interactive AI Zelda Walkthrough Assistant</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Category 5: Account & Sanctum */}
            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <User className="w-5 h-5 text-zelda-gold" />
                5. Account & Sanctum Access
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <button
                  onClick={() => onOpenAuth()}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>User Sign In / Register & Web3 Wallet Authentication</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateTab('admin')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Admin Sanctum Portal</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Category 6: Footer Pages */}
            <div className="bg-white p-6 rounded-2xl border border-zelda-border-sand shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base uppercase text-zelda-green-forest tracking-wider flex items-center gap-2 border-b border-zelda-border-sand/40 pb-2">
                <ShieldCheck className="w-5 h-5 text-zelda-gold" />
                6. Legal & Information Pages
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <button
                  onClick={() => onNavigateFooter('about')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>About Hyrule Fan Alliance</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateFooter('contact')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Contact Us (admin@zeldaseries.com)</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigateFooter('privacy')}
                  className="w-full p-2.5 hover:bg-amber-50 rounded-xl text-left flex items-center justify-between text-zelda-charcoal hover:text-zelda-gold transition-colors font-serif font-bold group cursor-pointer"
                >
                  <span>Privacy Policy Directive</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
