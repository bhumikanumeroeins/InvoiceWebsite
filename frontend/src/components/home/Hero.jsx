import { useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import invoiceImage from '../../assets/templates/images/11.jpg';

const benefits = [
  'GST & Tax compliant',
  'Secure & reliable',
  'Used by professionals',
];

const Hero = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  // Scroll transformations for stacked invoices
  const page4Y = useTransform(scrollY, [0, 600], [50, -250]);
  const page4Rotate = useTransform(scrollY, [0, 600], [-3, -12]);
  const page4Scale = useTransform(scrollY, [0, 600], [0.95, 0.88]);
  const page4Opacity = useTransform(scrollY, [0, 600], [0.8, 0]);

  const page3Y = useTransform(scrollY, [0, 600], [35, -180]);
  const page3Rotate = useTransform(scrollY, [0, 600], [-1.5, -8]);
  const page3Scale = useTransform(scrollY, [0, 600], [0.975, 0.92]);
  const page3Opacity = useTransform(scrollY, [0, 600], [0.85, 0]);

  const page2Y = useTransform(scrollY, [0, 600], [20, -100]);
  const page2Rotate = useTransform(scrollY, [0, 600], [0, -5]);
  const page2Scale = useTransform(scrollY, [0, 600], [0.99, 0.96]);
  const page2Opacity = useTransform(scrollY, [0, 600], [0.9, 0]);

  const page1Y = useTransform(scrollY, [0, 600], [0, -50]);

  // Animation variants
  const textVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const benefitVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' },
    }),
  };

  const buttonVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section
      className="relative bg-slate-50 border-b border-slate-200 overflow-hidden"
      ref={ref}
    >
      {/* Decorative Gradient Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100 to-emerald-100 opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 opacity-50 blur-3xl"></div>

      <div className="w-full py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SECTION */}
          <motion.div
            variants={textVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="inline-block mb-5 text-sm font-semibold text-indigo-600">
              Professional invoicing software
            </span>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Invoicing made simple <br />
              for modern businesses
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
              Create clean, professional invoices, manage clients,
              and track payments with a fast, secure invoicing platform.
            </p>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              variants={buttonVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition"
              >
                Create Invoice
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-7 py-4 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white transition"
              >
                View Templates
              </motion.button>
            </motion.div>

            {/* Benefits */}
            <div className="flex gap-8 flex-wrap">
              {benefits.map((item, i) => (
                <motion.div
                  key={item}
                  custom={i}
                  variants={benefitVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-600">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SECTION – SCROLLING MULTI-PAGE STACK */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm h-[460px]">

              {/* Page 4 – Oldest */}
              <motion.div
                style={{ y: page4Y, rotate: page4Rotate, scale: page4Scale, opacity: page4Opacity }}
                className="absolute top-10 left-6 w-full rounded-lg shadow-lg"
              >
                <div className="w-full rounded-lg bg-indigo-50 border border-indigo-200 overflow-hidden">
                  <img src={invoiceImage} alt="Invoice page 4" className="w-full rounded-lg" />
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  Draft
                </div>
              </motion.div>

              {/* Page 3 */}
              <motion.div
                style={{ y: page3Y, rotate: page3Rotate, scale: page3Scale, opacity: page3Opacity }}
                className="absolute top-6 left-4 w-full rounded-lg shadow-lg"
              >
                <div className="w-full rounded-lg bg-yellow-50 border border-yellow-200 overflow-hidden">
                  <img src={invoiceImage} alt="Invoice page 3" className="w-full rounded-lg" />
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                  Sent
                </div>
              </motion.div>

              {/* Page 2 */}
              <motion.div
                style={{ y: page2Y, rotate: page2Rotate, scale: page2Scale, opacity: page2Opacity }}
                className="absolute top-3 left-2 w-full rounded-lg shadow-md"
              >
                <div className="w-full rounded-lg bg-pink-50 border border-pink-200 overflow-hidden">
                  <img src={invoiceImage} alt="Invoice page 2" className="w-full rounded-lg" />
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">
                  Viewed
                </div>
              </motion.div>

              {/* Page 1 – Active */}
              <motion.div
                style={{ y: page1Y }}
                className="relative rounded-lg shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-emerald-50">
                  <span className="text-sm font-semibold text-slate-700">
                    Invoice Preview
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Paid
                  </span>
                </div>
                <div className="w-full rounded-b-lg overflow-hidden">
                  <img src={invoiceImage} alt="Invoice active" className="w-full" />
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
