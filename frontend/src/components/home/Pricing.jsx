import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { planAPI } from '../../services/planService';
import { useEffect, useState } from "react";


const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await planAPI.getAll();
        if (response.success) {
          const activePlans = response.data.filter(plan => plan.isActive === true);
          setPlans(activePlans);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

const handleSubscribe = async (planId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please sign in to subscribe.");
    window.location.href = "/signin";
    return;
  }

  try {
    const res = await planAPI.upgrade(planId);

    if (res.success) {
      alert("Subscription upgraded successfully!");
    }
  } catch (error) {
    console.error("Upgrade failed:", error.message);
    alert(error.message);
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500">Loading plans...</p>
      </div>
    );
  }
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }, 
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
            Choose the plan that works best for you.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {plans?.length > 0 && plans.map((plan) => {
            const isFree = plan.planName === "Free";
            const isPopular = plan.planName === "Yearly";

            const period =
              plan.durationMonths === 0
                ? "one-time"
                : plan.durationMonths === 1
                ? "per month"
                : `${plan.durationMonths} months`;

            const features = [
              plan.invoiceLimit === -1
                ? "Unlimited invoices"
                : `${plan.invoiceLimit} invoices total`,
              "All templates",
              "Email & reminders",
              "Payment tracking",
            ];

            const cta = isFree
              ? "Start Free"
              : `Subscribe ${plan.planName}`;

            return (
              <motion.div
                key={plan._id}
                variants={fadeUp}
                className={`relative rounded-3xl p-8 shadow-md transition-transform hover:scale-105 ${
                  isPopular
                    ? 'bg-gradient-to-br from-indigo-600 to-emerald-500 text-white shadow-lg'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.planName}
                  </h3>

                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-4xl sm:text-5xl font-bold ${isPopular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </span>
                    <span className={isPopular ? 'text-white/80' : 'text-gray-500'}>
                      /{period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isPopular ? 'bg-white/20' : 'bg-indigo-100'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          isPopular ? 'text-white' : 'text-indigo-600'
                        }`} />
                      </div>
                      <span className={isPopular ? 'text-white/90' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                onClick={() => handleSubscribe(plan._id)}
                  className={`w-full py-4 px-6 rounded-full font-semibold transition-all ${
                    isPopular
                      ? 'bg-white text-indigo-600 hover:shadow-lg'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
