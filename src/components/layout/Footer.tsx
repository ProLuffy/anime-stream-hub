import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">A</span>
              </div>
              <span className="font-display text-xl font-bold gradient-text">AniCrew</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for anime and donghua streaming.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-display font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/anime" className="text-muted-foreground hover:text-foreground transition-colors">Anime</Link></li>
              <li><Link to="/donghua" className="text-muted-foreground hover:text-foreground transition-colors">Donghua</Link></li>
              <li><Link to="/trending" className="text-muted-foreground hover:text-foreground transition-colors">Trending</Link></li>
              <li><Link to="/new-releases" className="text-muted-foreground hover:text-foreground transition-colors">New Releases</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">Register</Link></li>
              <li><Link to="/watchlist" className="text-muted-foreground hover:text-foreground transition-colors">Watchlist</Link></li>
              <li><Link to="/premium" className="text-muted-foreground hover:text-foreground transition-colors">Go Premium</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 AniCrew. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
