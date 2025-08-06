import Header from '@/components/Header';
import VirtualSelfChat from '@/components/VirtualSelfChat';
import Marquee from '@/components/Marquee';
import content from '@/data/content.json';
import AIPhilosophyGrid from '@/components/AIPhilosophyGrid';
import { DecoderText } from '@/components/ui/DecoderText';
import Hero from '@/components/Hero';

interface IndexProps {
  onSelectProject: (slug: string) => void;
  onGoHome: () => void;
}

const Index = ({ onSelectProject, onGoHome }: IndexProps) => {
  const { hero, about, workedWith, projects, contactLinks } = content;

  return (
    <div className="text-foreground min-h-screen font-mono relative z-[60]">
      <Header onGoHome={onGoHome} />
      <Hero onGoHome={onGoHome} onSelectProject={onSelectProject} />
             <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">

         <section id="about" className="mb-24 md:mb-32">
           <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
             <div>
                 <h3 className="text-2xl font-bold mb-4">{about.title}</h3>
                 <p className="text-foreground mb-4">
                     {about.paragraph1}
                 </p>
                 <p className="text-foreground">{about.paragraph2}</p>
             </div>
             <AIPhilosophyGrid />
           </div>
           
           <div className="mt-16">
             <VirtualSelfChat projects={projects} />
           </div>
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
