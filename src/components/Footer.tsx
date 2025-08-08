import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowLeft, ArrowLeftSquare, ArrowRight, ArrowRightCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-background text-foreground py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Top Section with Availability Badge */}
        <div className="mb-12">
          <div className="inline-block">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium overflow-hidden w-48">
              <div className="inline-flex animate-scroll whitespace-nowrap">
                <span className="mr-4">AVAILABLE FOR NEW PROJECTS  → </span>
                <span className="mr-4">AVAILABLE FOR NEW PROJECTS  →</span>
                <span className="mr-4">AVAILABLE FOR NEW PROJECTS  →</span>
                <span className="mr-4">AVAILABLE FOR NEW PROJECTS  →</span>
                <span className="mr-4">AVAILABLE FOR NEW PROJECTS  →</span>
                <span className="mr-4">AVAILABLE FOR NEW PROJECTS  →</span>
              </div>
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Left Column - Connect Section */}
          <div className="space-y-0">
            <h1 className="text-muted-foreground text-2xl font-bold ">Connect with me</h1>
            <div className="space-y-2">
              <div className="flex items-center text-foreground hover:text-blue-400 transition-colors cursor-pointer">
                <ArrowRight className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold" >Discover my other Projects</span>
              </div>
              <div className="flex items-center text-foreground hover:text-blue-400 transition-colors cursor-pointer">
                <ArrowRight className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">Kickstart your project</span>
              </div>
            </div>
          </div>

          {/* Middle Column - Social Links */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-foreground hover:text-blue-400 transition-colors cursor-pointer text-sm">
                TWITTER
              </div>
              <div className="text-foreground hover:text-blue-400 transition-colors cursor-pointer text-sm">
                INSTAGRAM
              </div>
              <div className="text-foreground hover:text-blue-400 transition-colors cursor-pointer text-sm">
                PRESS KIT
              </div>
            </div>
          </div>

          {/* Right Column - Additional Links */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-foreground hover:text-blue-400 transition-colors cursor-pointer text-sm">
                LINKEDIN
              </div>
              <div className="text-foreground hover:text-blue-400 transition-colors cursor-pointer text-sm">
                READ.CV
              </div>
            </div>
            
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="border-t border-border pt-8">
          <div className="text-muted-foreground text-xs space-y-1">
            <div>Codefrydev © 2025</div>
            <div>All Rights Reserved – because fun isn’t free (yet).</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 