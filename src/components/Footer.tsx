import { motion } from 'framer-motion';
import { Linkedin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="py-4 px-4 mt-auto pointer-events-none"
    >
      <div className="container mx-auto flex justify-center pointer-events-auto">
      <div className="container mx-auto flex justify-center">
        <Button
          asChild
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300 rounded-full px-6"
        >
          <a
            href="https://www.linkedin.com/in/edafeoghene-egona-7795871a5/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-sm">Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span className="text-sm">by</span>
            <span className="font-semibold">Edafeoghene Egona</span>
            <Linkedin className="h-4 w-4 text-[#0A66C2]" />
          </a>
        </Button>
      </div>
      </div>
    </motion.footer>
  );
}
