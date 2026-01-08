import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: ['5 invoices per month', 'Basic templates', 'Email support', 'PDF downloads'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'Best for growing businesses',
    features: ['Unlimited invoices', 'All premium templates', 'Priority support', 'Custom branding', 'Payment tracking', 'Recurring invoices'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: 'per month',
    description: 'For large teams & agencies',
    features: ['Everything in Pro', 'Team collaboration', 'API access', 'Advanced analytics', 'Dedicated manager', 'Custom integrations'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const Pricing = () => {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }, // sequential animation for cards
  };

  return (
    <section id="pricing" className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600">
            Choose the plan that works best for you. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative rounded-3xl p-8 shadow-md transition-transform hover:scale-105 ${
                plan.popular
                  ? 'bg-gradient-to-br from-indigo-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl sm:text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  <span className={plan.popular ? 'text-white/80' : 'text-gray-500'}>/{plan.period}</span>
                </div>
                <p className={`mt-2 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-white/20' : 'bg-indigo-100'}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-indigo-600'}`} />
                    </div>
                    <span className={plan.popular ? 'text-white/90' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 px-6 rounded-full font-semibold transition-all ${
                  plan.popular
                    ? 'bg-white text-indigo-600 hover:shadow-lg'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
