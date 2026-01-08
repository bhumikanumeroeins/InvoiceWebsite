import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA = () => {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Mini Badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-indigo-400 rounded-full text-sm font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          Start creating invoices today
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
        >
          Ready to get paid faster?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className="text-xl text-slate-300 max-w-2xl"
        >
          Join over 100,000 businesses using InvoicePro to create professional invoices and get paid on time.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
        >
          <button className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2">
            Create Your First Invoice
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20">
            View Demo
          </button>
        </motion.div>

        {/* Footnote */}
        <motion.p
          variants={fadeUp}
          className="mt-8 text-slate-400 text-sm"
        >
          No credit card required • Free plan available • Cancel anytime
        </motion.p>
      </motion.div>
    </section>
  );
};

export default CTA;
