import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown, Check, Download, Zap, Shield, Star,
  CreditCard, Lock, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    period: '/month',
    popular: false,
    features: [
      'Unlimited streaming in 4K',
      'Download episodes for offline viewing',
      'Ad-free experience',
      'Early access to new releases',
      'Priority customer support',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 79.99,
    period: '/year',
    popular: true,
    savings: 'Save 33%',
    features: [
      'Everything in Monthly',
      'Exclusive anime merchandise discounts',
      'Access to premium-only content',
      'Custom profile themes',
      'Beta features access',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 199.99,
    period: 'one-time',
    popular: false,
    features: [
      'Everything in Yearly',
      'Lifetime access guaranteed',
      'VIP community access',
      'Name in credits',
      'Free future upgrades',
    ],
  },
];

const features = [
  {
    icon: Download,
    title: 'Unlimited Downloads',
    description: 'Download any episode or movie to watch offline. Available in all quality options.',
  },
  {
    icon: Zap,
    title: '4K Ultra HD',
    description: 'Stream in the highest quality available. Experience anime like never before.',
  },
  {
    icon: Shield,
    title: 'Ad-Free',
    description: 'No interruptions. Just pure anime enjoyment without any advertisements.',
  },
  {
    icon: Star,
    title: 'Early Access',
    description: 'Watch new episodes hours before free users. Be the first to see new content.',
  },
];

const PremiumPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      toast.success('Stripe integration required. Please enable Lovable Cloud and Stripe.');
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Unlock the Full <span className="gradient-text">AniCrew</span> Experience
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Download your favorite anime, stream in 4K, and enjoy an ad-free experience. 
                Premium members get exclusive benefits and early access to new content.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-card/50 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground">All plans include a 7-day free trial</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:border-primary/50'
                  } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={plan.popular ? 'pt-8' : ''}>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <Badge variant="secondary" className="mt-2 w-fit">
                        {plan.savings}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Subscribe Button */}
            <div className="max-w-md mx-auto mt-12">
              <Button
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg h-14"
                onClick={handleSubscribe}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Start 7-Day Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                  <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What payment methods are accepted?</h3>
                  <p className="text-muted-foreground">We accept all major credit cards, debit cards, and UPI payments through our secure Stripe integration.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                  <p className="text-muted-foreground">Yes! All plans include a 7-day free trial. You won't be charged until the trial ends.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PremiumPage;
