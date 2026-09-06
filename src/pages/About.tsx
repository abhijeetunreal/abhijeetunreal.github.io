import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import content from '@/data/content.json';
import { slugify } from '@/lib/utils';
import Footer from '@/components/Footer';
import SidebarCarousel from '@/components/SidebarCarousel';

interface AboutProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onNavigateToExperimental: () => void;
  onNavigateToBlog: () => void;
  onSelectBlogPost: (slug: string) => void;
}

const About: React.FC<AboutProps> = ({ onGoHome, onGoToAbout, onNavigateToExperimental, onNavigateToBlog }) => {
  const { aboutPage, contactLinks } = content as any;
  const [expanded, setExpanded] = useState(false);

  const linkedinUrl = (contactLinks || []).find((l: any) => l.label === 'LINKEDIN')?.href || '';
  const emailHref = (contactLinks || []).find((l: any) => l.label === 'EMAIL')?.href || '';

  const extractLinkedinVanity = (url: string) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && (parts[0] === 'in' || parts[0] === 'pub')) return parts[1];
      return parts[parts.length - 1] || '';
    } catch (e) {
      return '';
    }
  };

  const linkedinVanity = extractLinkedinVanity(linkedinUrl);
  const profileImage = (content as any).profileImage || '';

  // static LinkedIn rendering only — no server fetch

  useEffect(() => {
    if (!linkedinVanity) return;
    const id = 'linkedin-badges-js';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.src = 'https://platform.linkedin.com/badges/js/profile.js';
      s.async = true;
      s.defer = true;
      s.id = id;
      document.body.appendChild(s);
      return () => { s.remove(); };
    }
  }, [linkedinVanity]);

  return (
    <div className="text-foreground min-h-screen font-sans relative z-[60] dark:text-gray-100">
      <Header onGoHome={onGoHome} onGoToAbout={onGoToAbout} currentSection="ABOUT" />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-4 py-8 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
        <section className="bg-white dark:bg-slate-900 rounded-lg border border-linkedin dark:border-slate-700 overflow-hidden relative">
          {/* Cover Image */}
          <div className="h-32 sm:h-48 w-full bg-slate-300 relative">
            <img src="https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Cover" className="w-full h-full object-cover" />
          </div>

          {/* Avatar / LinkedIn badge */}
          <div className="absolute top-16 sm:top-24 left-4 sm:left-6 rounded-full border-4 border-white shadow-sm w-32 h-32 sm:w-40 sm:h-40 bg-white z-10 overflow-hidden flex items-center justify-center">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : linkedinVanity ? (
              <div className="w-full">
                <div
                  className="LI-profile-badge"
                  data-version="v1"
                  data-size="medium"
                  data-locale="en_US"
                  data-type="vertical"
                  data-theme="light"
                  data-vanity={linkedinVanity}
                >
                  <a className="li-linkedin" href={linkedinUrl}>{aboutPage.title || 'Profile'}</a>
                </div>
              </div>
            ) : (
              <img src="https://placehold.co/400x400/0a66c2/FFFFFF?text=Abhijeet" alt="Abhijeet" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 pt-16 sm:pt-20">
            <div className="flex justify-between items-start">
              <div className="max-w-xl">
                <h1 className="text-2xl font-semibold text-linkedin-black dark:text-gray-100 leading-tight flex items-center gap-2">
                  Abhijeet
                  <i className="fa-solid fa-circle-check text-gray-400 text-sm" title="Verified" />
                </h1>
                <div className="text-base text-linkedin-black dark:text-gray-300 mt-1">Product Design Engineer | Ex-Airbus | Codefrydev</div>
                <div className="text-sm text-linkedin-gray dark:text-gray-400 mt-2 font-normal">
                  Bengaluru, Karnataka, India · <a href={emailHref || '#'} className="text-linkedin-blue font-semibold hover:underline">Contact info</a>
                </div>
                <div className="text-sm text-linkedin-blue font-semibold mt-1 hover:underline cursor-pointer">
                  500+ connections
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 w-56 text-sm">
                <img src={(content as any).profileImage || 'https://placehold.co/32x32/333/FFF?text=C'} alt="Org" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                <span className="text-sm text-linkedin-black dark:text-white font-medium">CodeFryDev</span>
              </div>
            </div>

            {/* Action / highlight */}
            <div className="mt-4">
              <a href={linkedinUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0A66C2] text-white rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-[#084a9e] transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zM7 19h-3v-10h3v10zM5.5 7.5c-0.966 0-1.75-0.784-1.75-1.75s0.784-1.75 1.75-1.75 1.75 0.784 1.75 1.75-0.784 1.75-1.75 1.75zM20 19h-3v-5.5c0-1.657-1.343-3-3-3s-3 1.343-3 3v5.5h-3v-10h3v1.4c0.876-1.313 2.616-2.4 4.5-2.4 3.314 0 6 2.686 6 6v5z"/></svg>
                View on LinkedIn
              </a>
            </div>

              <div className="mt-6 bg-[#dde7f1] rounded-lg p-3 w-full sm:w-80 cursor-pointer hover:shadow-sm transition dark:bg-slate-800">
              <h3 className="font-semibold text-sm">Open to work</h3>
              <p className="text-sm text-linkedin-black dark:text-gray-200 mt-1">Full Stack Engineer, Frontend Developer, Backend Developer</p>
              <span className="text-sm font-semibold text-linkedin-blue mt-2 inline-block">Show details</span>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-lg border border-linkedin dark:border-slate-700 p-6 mt-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-linkedin-black dark:text-gray-100">Education</h2>
          </div>

          {aboutPage.education.map((edu: any, idx: number) => (
            <div key={idx} className={`flex gap-4 ${idx < aboutPage.education.length - 1 ? 'mb-6' : ''}`}>
              <div className="w-12 h-12 flex-shrink-0 mt-1 flex items-center justify-center">
                <img src={edu.logo || 'https://placehold.co/48x48/666/FFF?text=E'} alt="Institution Logo" className="w-full h-full rounded-sm object-contain border border-gray-200" />
              </div>
              <div className={`flex flex-col ${idx < aboutPage.education.length - 1 ? 'border-b border-gray-100 pb-6 w-full' : 'w-full'}`}>
                <h3 className="text-base font-semibold text-linkedin-black dark:text-gray-100">{edu.degree}</h3>
                <p className="text-sm text-linkedin-black dark:text-gray-300">{edu.institution}</p>
                <p className="text-sm text-linkedin-gray dark:text-gray-400 font-normal">{edu.year}</p>
                {edu.description && (
                  <p className="text-sm text-linkedin-black dark:text-gray-200 mt-3 leading-relaxed">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-lg border border-linkedin dark:border-slate-700 p-6 mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-linkedin-black dark:text-gray-100">About</h2>
          </div>

          <div className="relative">
            <p id="about-text" className={`text-sm text-linkedin-black dark:text-gray-200 leading-relaxed whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}>
              {aboutPage.bio.intro}
              {!expanded && ' '}
              {expanded && (
                <>
                  {' '}
                  {aboutPage.bio.mission}
                </>
              )}
            </p>

            <div className="flex justify-end mt-1">
              <button onClick={() => setExpanded(!expanded)} className="text-linkedin-gray dark:text-gray-300 font-semibold text-sm hover:text-linkedin-blue hover:underline transition flex items-center gap-1 bg-white dark:bg-transparent pl-2">
                {expanded ? '...see less' : '...see more'}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-gem text-linkedin-gray dark:text-gray-400 mt-1" />
              <div>
                <span className="text-sm font-semibold text-linkedin-black dark:text-gray-100">Top skills</span>
                <p className="text-sm text-linkedin-gray dark:text-gray-400 mt-1">{aboutPage.skills.design.slice(0,5).join(' • ')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-lg border border-linkedin dark:border-slate-700 p-6 mt-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-linkedin-black dark:text-gray-100">Experience</h2>
          </div>

          {aboutPage.experience.map((exp, idx) => (
            <div key={idx} className={`flex gap-4 ${idx < aboutPage.experience.length - 1 ? 'mb-6' : ''}`}>
              <div className="w-12 h-12 flex-shrink-0 mt-1 cursor-pointer">
                <img src={exp.companyLogo || 'https://placehold.co/48x48/333/FFF?text=C'} alt="Company Logo" className="w-full h-full rounded-sm object-cover border border-gray-200" />
              </div>
              <div className={`flex flex-col ${idx < aboutPage.experience.length - 1 ? 'border-b border-gray-100 pb-6 w-full' : 'w-full'}`}>
                <h3 className="text-base font-semibold text-linkedin-black dark:text-gray-100">{exp.role}</h3>
                <p className="text-sm text-linkedin-black dark:text-gray-300">{exp.company} · {exp.duration}</p>
                <p className="text-sm text-linkedin-gray dark:text-gray-400 font-normal">{exp.location || ''}</p>
                <p className="text-sm text-linkedin-black dark:text-gray-200 mt-3 leading-relaxed">{exp.description}</p>
                {exp.skills && (
                  <div className="mt-3 flex gap-2 text-sm text-linkedin-gray dark:text-gray-400">
                    <i className="fa-solid fa-gem mt-1 text-xs" />
                    <span><b>Skills:</b> {exp.skills.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
          </div>

          <aside className="md:col-span-1 space-y-4">
            {aboutPage.sidebar?.carouselImages && aboutPage.sidebar.carouselImages.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm dark:text-gray-200">
                <SidebarCarousel items={aboutPage.sidebar.carouselImages} />
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm dark:text-gray-200">
              {aboutPage.sidebar?.currentWork?.images && aboutPage.sidebar.currentWork.images.length > 0 && (
                <div className="mb-3">
                  <SidebarCarousel items={aboutPage.sidebar.currentWork.images} />
                </div>
              )}
              <h3 className="text-sm font-semibold mb-2">{aboutPage.sidebar?.currentWork?.title || 'Currently'}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{aboutPage.sidebar?.currentWork?.content}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm dark:text-gray-200">
              {aboutPage.sidebar?.newsImages && aboutPage.sidebar.newsImages.length > 0 && (
                <div className="mb-3">
                  <SidebarCarousel items={aboutPage.sidebar.newsImages} />
                </div>
              )}
              <h3 className="text-sm font-semibold mb-2">Latest news</h3>
              <ul className="text-sm space-y-2">
                {(aboutPage.sidebar?.news || []).map((n: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-blue-600" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm dark:text-gray-200">
              <h3 className="text-sm font-semibold mb-2">Latest blogs</h3>
              <ul className="space-y-3">
                {((content as any).blogPosts || []).slice(0,4).map((post: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-3">
                    {post.cardImage ? (
                      <button type="button" onClick={() => { console.log('[About] click thumb', post.title); onSelectBlogPost(slugify(post.title)); }} className="block w-12 h-12 shrink-0 rounded-sm overflow-hidden p-0 border-0 bg-transparent">
                        <img src={post.cardImage} alt={post.title} className="w-full h-full object-cover" />
                      </button>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-sm" />
                    )}
                    <div className="flex-1">
                      <button type="button" onClick={() => { console.log('[About] click title', post.title); onSelectBlogPost(slugify(post.title)); }} className="text-left w-full text-sm font-medium text-linkedin-black dark:text-gray-100 hover:underline">
                        {post.title}
                      </button>
                      {post.tags && <div className="text-xs text-gray-500 dark:text-gray-400">{post.tags.slice(0,2).join(' • ')}</div>}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 text-right">
                <a href="#blog" onClick={(e) => { e.preventDefault(); onNavigateToBlog(); }} className="text-sm font-semibold text-linkedin-blue hover:underline">View all blogs</a>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm dark:text-gray-200">
              {aboutPage.sidebar?.ngo?.images && aboutPage.sidebar.ngo.images.length > 0 && (
                <div className="mb-3">
                  <SidebarCarousel items={aboutPage.sidebar.ngo.images} />
                </div>
              )}
              <h3 className="text-sm font-semibold mb-2">NGO & community</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="font-semibold">{aboutPage.sidebar?.ngo?.name}</div>
                <div className="text-xs text-gray-500">{aboutPage.sidebar?.ngo?.role}</div>
                <p className="mt-2">{aboutPage.sidebar?.ngo?.description}</p>
                {aboutPage.sidebar?.ngo?.link && (
                  <a href={aboutPage.sidebar.ngo.link} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs text-linkedin-blue hover:underline">Learn more</a>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm dark:text-gray-200">
              {aboutPage.sidebar?.hobbyImages && aboutPage.sidebar.hobbyImages.length > 0 && (
                <div className="mb-3">
                  <SidebarCarousel items={aboutPage.sidebar.hobbyImages} />
                </div>
              )}
              <h3 className="text-sm font-semibold mb-2">Hobbies & extra life</h3>
              <div className="flex flex-wrap gap-2">
                {(aboutPage.sidebar?.hobbies || []).map((h: string) => (
                  <span key={h} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{h}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">{aboutPage.sidebar?.extraLife}</p>
            </div>
          </aside>
        </div>
      </main>

      <Footer onNavigateToExperimental={onNavigateToExperimental} onNavigateToBlog={onNavigateToBlog} />
    </div>
  );
};

export default About;