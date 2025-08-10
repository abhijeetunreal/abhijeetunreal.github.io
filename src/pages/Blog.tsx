import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import content from '@/data/content.json';
import { slugify } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onSelectBlogPost: (slug: string) => void;
  onNavigateToExperimental: () => void;
  onNavigateToBlog: () => void;
}

const Blog: React.FC<BlogProps> = ({ onGoHome, onSelectBlogPost, onGoToAbout, onNavigateToExperimental, onNavigateToBlog }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onGoHome={onGoHome} onGoToAbout={onGoToAbout} currentSection="BLOG" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Page Description */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Design Insights & Thoughts
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Exploring the intersection of design, technology, and human experience. 
            Sharing insights, research findings, and thoughts on the future of digital design.
          </p>
        </div>

        {/* Blog Posts Grid - Image-only cards with title above */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 md:gap-6 mb-16">
          {content.blogPosts.map((post, index) => (
            <div
              key={index}
              className="group cursor-pointer blog-card"
              onClick={() => onSelectBlogPost(slugify(post.title))}
            >
              {/* Title above the card */}
              <h3 className="text-xs md:text-sm font-test mb-0 text-left">
                {post.title}
              </h3>
              
              {/* Card with full image */}
              <Card className="animate-fade-in border-accent group-hover:border-primary transition-colors overflow-hidden aspect-[3/4] rounded-sm" style={{ animationDelay: `${index * 50}ms` }}>
                {post.cardImage && (
                  <div
                    className="w-full h-full bg-cover bg-center relative blog-card-image"
                    style={{ backgroundImage: `url(${post.cardImage})` }}
                    data-src={post.cardImage}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Want to discuss any of these topics or collaborate on research?
          </p>
          <Button size="lg" className="px-8 py-3">
            Let's Connect
          </Button>
        </div>
      </main>
      <Footer onNavigateToExperimental={onNavigateToExperimental} onNavigateToBlog={onNavigateToBlog} />
    </div>
  );
};

export default Blog;
