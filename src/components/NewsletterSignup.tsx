import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Subscribed!",
      description: "You'll receive updates on new products and exclusive offers.",
    });
    
    setEmail('');
    setLoading(false);
  };

  return (
    <div className="bg-gradient-subtle p-6 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Subscribe to Newsletter</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Get updates on new arrivals, exclusive offers, and anime news!
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-elegant"
          required
        />
        <Button type="submit" disabled={loading} className="btn-primary">
          Subscribe
        </Button>
      </form>
    </div>
  );
};
