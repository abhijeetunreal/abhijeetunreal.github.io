import Header from '@/components/Header';
import VirtualSelfChat from '@/components/VirtualSelfChat';
import ProjectShowcase from '@/components/ProjectShowcase';
import Marquee from '@/components/Marquee';
import content from '@/data/content.json';
import AIPhilosophyGrid from '@/components/AIPhilosophyGrid';
import { DecoderText } from '@/components/ui/DecoderText';

interface IndexProps {
  onSelectProject: (slug: string) => void;
  onGoHome: () => void;
}

const Index = ({ onSelectProject, onGoHome }: IndexProps) => {
  const { hero, work, about, workedWith, projects, contactLinks } = content;
  const allTags = [...new Set(projects.flatMap((p) => p.tags))].sort();

  return (
    <div className="text-foreground min-h-screen font-mono relative z-[60]">
      <Header onGoHome={onGoHome} />
      <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
        <section id="hero" className="mb-24 md:mb-32">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">
            <DecoderText text={hero.title} animationDelay={24} />
          </h2>
        </section>

        <section id="work" className="mb-24 md:mb-32">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-2xl font-bold shrink-0">{work.title}</h3>
              <p className="text-sm text-foreground hidden md:block">{work.subtitle}</p>
            </div>
          </div>
          <ProjectShowcase projects={projects} tags={allTags} onSelectProject={onSelectProject} />
        </section>

        <section id="ai-playground" className="mb-24 md:mb-32">
            <div>
                <VirtualSelfChat projects={projects} />
            </div>
        </section>

        <section id="about" className="mb-24 md:mb-32 grid md:grid-cols-2 gap-8 items-start">
            <div>
                <h3 className="text-2xl font-bold mb-4">{about.title}</h3>
                <p className="text-foreground mb-4">
                    {about.paragraph1}
                </p>
                <p className="text-foreground">{about.paragraph2}</p>
            </div>
            <AIPhilosophyGrid />
        </section>

        <section id="worked-with" className="mb-24 md:mb-32">
          <h3 className="text-2xl font-bold text-center mb-8">{workedWith.title}</h3>
          <Marquee items={workedWith.companies} />
        </section>

      </main>
      <footer id="contact" className="container mx-auto p-4 border-t-2 border-border text-center">
        <div className="flex justify-center gap-6 font-bold text-sm">
            {contactLinks.map(link => (
                <a href={link.href} key={link.label} className="hover:text-primary transition-colors">{link.label}</a>
            ))}
        </div>
      </footer>
    </div>
  );
};

export default Index;
