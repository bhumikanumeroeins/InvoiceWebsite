import {
  FileText,
  Palette,
  Send,
  CreditCard,
  BarChart3,
  Shield,
  Zap,
  Clock,
  Users,
  Wallet
} from 'lucide-react';

import invoiceImage from '../../assets/templates/images/5.jpg';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'Easy Invoice Creation',
    description: 'Create clean, professional invoices in minutes using a simple editor.',
  },
  {
    icon: Palette,
    title: 'Modern Templates',
    description: 'Choose from beautifully designed invoice templates for every business.',
  },
  {
    icon: Send,
    title: 'Instant Sharing',
    description: 'Send invoices instantly via email or secure shareable links.',
  },
  {
    icon: CreditCard,
    title: 'Online Payments',
    description: 'Accept payments through cards, UPI, bank transfer, and wallets.',
  },
  {
    icon: BarChart3,
    title: 'Payment Tracking',
    description: 'Track paid, unpaid, and overdue invoices in real time.',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Your data is protected with bank-grade security and compliance.',
  },
];

const stats = [
  { value: '100K+', label: 'Businesses trust us' },
  { value: '2M+', label: 'Invoices generated' },
  { value: '$500M+', label: 'Payments processed' },
  { value: '99.9%', label: 'Platform uptime' },
];

const Features = () => {
  // Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } }, // timeline steps appear one by one
  };

  return (
    <section id="features" className="bg-white">

      {/* PRIME GRADIENT HERO BAND */}
      <motion.div
        className="w-full bg-linear-to-r from-indigo-600 to-emerald-500 py-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >

        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Built for faster payments
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            A modern invoicing platform designed to reduce effort and increase cash flow.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* HIGHLIGHT WORKFLOW CONTAINER */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">

          {/* LEFT TIMELINE */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl"
          >
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
              Complete invoice lifecycle
            </h3>
            <p className="text-slate-600 mb-10">
              From creation to payment – everything happens inside one simple system.
            </p>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="flex flex-col gap-8"
              >
                {/* Timeline steps */}
                {[
                  {
                    icon: FileText,
                    stepBg: 'bg-emerald-100 text-emerald-700',
                    stepNum: 'Step 1',
                    title: 'Create invoice',
                    desc: 'Use editor to generate invoice quickly.',
                  },
                  {
                    icon: Palette,
                    stepBg: 'bg-orange-100 text-orange-700',
                    stepNum: 'Step 2',
                    title: 'Apply template',
                    desc: 'Select professional design matching brand.',
                  },
                  {
                    icon: Send,
                    stepBg: 'bg-indigo-50 text-indigo-700',
                    stepNum: 'Step 3',
                    title: 'Send to client',
                    desc: 'Email or share secure invoice link.',
                  },
                  {
                    icon: CreditCard,
                    stepBg: 'bg-yellow-100 text-yellow-800',
                    stepNum: 'Step 4',
                    title: 'Get paid faster',
                    desc: 'Accept online payments and track status.',
                  },
                ].map(({ icon: Icon, stepBg, stepNum, title, desc }) => (
                  <motion.div
                    key={title}
                    variants={fadeUp} // each step fades in sequentially
                    className="flex items-start gap-5"
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-indigo-700"/>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${stepBg} mb-2`}>
                        {stepNum}
                      </span>
                      <h4 className="font-semibold text-slate-800">{title}</h4>
                      <p className="text-sm text-slate-600">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* SMALL CREATIVE ACTION BAND */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="mt-12 flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 w-fit"
            >
              <Clock className="w-5 h-5 text-indigo-600"/>
              <span className="text-sm font-medium text-slate-700">
                Average invoice paid in <b>3 days</b>
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="rounded-3xl border border-slate-200 overflow-hidden shadow-xl"
          >
            <img src={invoiceImage} alt="payment preview" className="w-full"/>
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group rounded-3xl border border-slate-200 p-8 hover:shadow-xl transition-all bg-linear-to-br from-white to-indigo-50"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition">
                <Icon className="w-7 h-7 text-indigo-700 group-hover:text-white transition"/>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* STATS */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-20 w-full pt-20"
        >
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
            {stats.map(({ value, label }, index) => {
              const colors = [
                'bg-indigo-100 text-indigo-900',
                'bg-emerald-100 text-emerald-900',
                'bg-pink-100 text-pink-900',
                'bg-yellow-100 text-yellow-900',
              ];
              return (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className={`flex-1 flex flex-col items-center justify-center rounded-2xl p-10 shadow-md min-w-[200px] ${colors[index]}`}
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-center">{value}</div>
                  <div className="text-sm font-medium text-center">{label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default Features;
