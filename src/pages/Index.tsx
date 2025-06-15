import Header from '@/components/Header';
import VirtualSelfChat from '@/components/VirtualSelfChat';
import InteractiveGrid from '@/components/InteractiveGrid';
import ProjectShowcase from '@/components/ProjectShowcase';
import Logo from '@/components/Logo';

const projects = [
  {
    title: "Project Alpha",
    description: "An immersive data narrative exploring climate change through generative visuals.",
    tags: ["Data Visualization", "Web GL", "Storytelling"],
  },
  {
    title: "Project Beta",
    description: "A mobile app that uses AI to create personalized soundscapes for focus and relaxation.",
    tags: ["AI", "UX Design", "Mobile App", "Wellness", "Data Visualization"],
  },
  {
    title: "Project Gamma",
    description: "A speculative design project imagining future interfaces for brain-computer interaction.",
    tags: ["Speculative Design", "HCI", "Prototyping", "AI"],
  },
  {
    title: "Project Delta",
    description: "An interactive installation about AI ethics.",
    tags: ["AI", "Storytelling", "Data Visualization"],
  },
];

const Index = () => {
  const allTags = [...new Set(projects.flatMap((p) => p.tags))].sort();

  return (
    <div className="bg-background text-foreground min-h-screen font-mono">
      <Header />
      <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
        <section id="hero" className="mb-24 md:mb-32">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            I experiment with technology, blend it with design, and innovate for human needs.
          </h2>
        </section>

        <div className="flex justify-center mb-16">
          <Logo />
        </div>

        <section id="ai-playground" className="mb-24 md:mb-32">
            <p className="text-sm text-muted-foreground mb-8 text-center md:text-left">Interact with my digital self.</p>
            <div>
                <VirtualSelfChat projects={projects} />
            </div>
        </section>

        <section id="work" className="mb-24 md:mb-32">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-2xl font-bold shrink-0">[SELECTED WORKS]</h3>
              <p className="text-sm text-muted-foreground hidden md:block">Click a category to filter the projects.</p>
            </div>
          </div>
          <ProjectShowcase projects={projects} tags={allTags} />
        </section>

        <section id="about" className="mb-24 md:mb-32 grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h3 className="text-2xl font-bold mb-4">[ABOUT ME]</h3>
                <p className="text-muted-foreground mb-4">
                    As a designer, I am driven by the convergence of disparate fields. 
                    I thrive on combining, blending, and innovating with emerging technologies to create experiences that are not just useful, but meaningful. My process is a dialogue between human needs and technological possibilities.
                </p>
                <p className="text-muted-foreground">Click the grid to reveal a core tenet of my design philosophy.</p>
            </div>
            <InteractiveGrid />
        </section>

      </main>
      <footer id="contact" className="container mx-auto p-4 border-t-2 border-border text-center">
        <div className="flex justify-center gap-6 font-bold text-sm">
            <a href="#" className="hover:text-primary transition-colors">[EMAIL]</a>
            <a href="#" className="hover:text-primary transition-colors">[LINKEDIN]</a>
            <a href="#" className="hover:text-primary transition-colors">[GITHUB]</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
