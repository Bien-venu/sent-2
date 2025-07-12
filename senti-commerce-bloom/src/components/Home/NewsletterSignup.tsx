
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      toast({
        title: "Subscribed!",
        description: "Thanks for joining our newsletter.",
      });
      setEmail('');
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay in the Loop</h2>
        <p className="text-gray-600 mb-8">
          Subscribe to our newsletter for the latest updates, deals, and sentiment trends.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center sm:text-left"
          />
          <Button type="submit" className="w-full sm:w-auto">Subscribe</Button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;
