import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Crown, Check, Download, Zap, Shield, Star,
  CreditCard, Lock, ArrowRight, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 99,
    currency: '₹',
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
    price: 799,
    currency: '₹',
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
    price: 1999,
    currency: '₹',
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

// Payment configuration - YOU CAN EDIT THIS
// Add your PayPal/Razorpay payment links here
const PAYMENT_CONFIG = {
  // Option 1: PayPal payment links
  paypal: {
    enabled: false, // Set to true when you add PayPal
    monthly: 'https://paypal.me/yourlink/99',
    yearly: 'https://paypal.me/yourlink/799',
    lifetime: 'https://paypal.me/yourlink/1999',
  },
  // Option 2: Razorpay payment links (works in India)
  razorpay: {
    enabled: false, // Set to true when you add Razorpay
    monthly: 'https://rzp.io/your-monthly-link',
    yearly: 'https://rzp.io/your-yearly-link',
    lifetime: 'https://rzp.io/your-lifetime-link',
  },
  // Option 3: UPI payment (India)
  upi: {
    enabled: false, // Set to true when you add UPI
    id: 'yourname@upi', // Your UPI ID
    qrCode: '', // Optional: URL to QR code image
  },
};

const PremiumPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const { profile, updateProfile } = useUserProfile();
  const navigate = useNavigate();

  // Function to activate premium - call this after successful payment
  const activatePremium = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    const now = new Date();
    let expiryDate: Date;

    switch (planId) {
      case 'monthly':
        expiryDate = new Date(now.setMonth(now.getMonth() + 1));
        break;
      case 'yearly':
        expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      case 'lifetime':
        expiryDate = new Date('2099-12-31');
        break;
      default:
        expiryDate = new Date(now.setMonth(now.getMonth() + 1));
    }

    updateProfile({
      isPremium: true,
      premiumPlan: planId,
      premiumExpiry: expiryDate.toISOString(),
    });

    toast.success(`🎉 Premium ${plan?.name} activated! Enjoy your benefits!`);
    navigate('/settings');
  };

  // Handle subscribe button click
  const handleSubscribe = () => {
    if (profile.isPremium) {
      toast.info('You already have premium!');
      return;
    }

    setShowPaymentOptions(true);
  };

  // Get payment link for selected plan
  const getPaymentLink = (gateway: 'paypal' | 'razorpay') => {
    return PAYMENT_CONFIG[gateway][selectedPlan as keyof typeof PAYMENT_CONFIG.paypal];
  };

  // Manual activation for testing (remove in production)
  const handleManualActivation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      activatePremium(selectedPlan);
      setIsProcessing(false);
    }, 1500);
  };

  // If already premium, show status
  if (profile.isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">You're Premium! 👑</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Plan: <span className="font-semibold capitalize">{profile.premiumPlan || 'Active'}</span>
            </p>
            {profile.premiumExpiry && (
              <p className="text-muted-foreground mb-8">
                Valid until: {new Date(profile.premiumExpiry).toLocaleDateString()}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <Card className="p-4">
                <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Downloads</p>
                <p className="text-2xl font-bold text-primary">Unlimited</p>
              </Card>
              <Card className="p-4">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Quality</p>
                <p className="text-2xl font-bold text-primary">4K</p>
              </Card>
            </div>
            <Button asChild size="lg">
              <Link to="/">Start Watching</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                      <span className="text-4xl font-bold">{plan.currency}{plan.price}</span>
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
            <div className="max-w-md mx-auto mt-12 space-y-4">
              {!showPaymentOptions ? (
                <Button
                  size="lg"
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg h-14"
                  onClick={handleSubscribe}
                >
                  <CreditCard className="w-5 h-5" />
                  Subscribe Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <div className="space-y-4 p-6 bg-card rounded-xl border">
                  <h3 className="font-semibold text-center mb-4">Choose Payment Method</h3>
                  
                  {/* PayPal */}
                  {PAYMENT_CONFIG.paypal.enabled && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <a href={PAYMENT_CONFIG.paypal[selectedPlan as 'monthly' | 'yearly' | 'lifetime']} target="_blank" rel="noopener noreferrer">
                        PayPal
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}

                  {/* Razorpay */}
                  {PAYMENT_CONFIG.razorpay.enabled && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <a href={PAYMENT_CONFIG.razorpay[selectedPlan as 'monthly' | 'yearly' | 'lifetime']} target="_blank" rel="noopener noreferrer">
                        Razorpay (UPI, Cards, NetBanking)
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}

                  {/* UPI */}
                  {PAYMENT_CONFIG.upi.enabled && (
                    <div className="text-center p-4 bg-secondary/50 rounded-lg">
                      <p className="text-sm mb-2">Pay via UPI</p>
                      <code className="text-lg font-mono text-primary">{PAYMENT_CONFIG.upi.id}</code>
                      <p className="text-xs text-muted-foreground mt-2">
                        After payment, share screenshot to activate
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Manual Activation (for testing) */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      After completing payment:
                    </p>
                    <Button
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      onClick={handleManualActivation}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        'Activating...'
                      ) : (
                        <>
                          <Crown className="w-5 h-5" />
                          Activate Premium
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click after payment to activate your premium
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowPaymentOptions(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Secure payment • Cancel anytime</span>
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
                  <p className="text-muted-foreground">We accept UPI, PayPal, Razorpay, and all major credit/debit cards.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How do I activate premium after payment?</h3>
                  <p className="text-muted-foreground">After completing payment, click the "Activate Premium" button to instantly unlock all benefits.</p>
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