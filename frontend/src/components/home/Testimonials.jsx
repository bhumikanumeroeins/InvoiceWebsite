import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Freelance Designer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'InvoicePro has completely transformed how I handle billing. I used to spend hours on invoices, now it takes minutes!',
  },
  {
    name: 'Michael Chen',
    role: 'CEO, TechStart Inc.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'We switched from spreadsheets to InvoicePro and never looked back. The payment tracking feature is a game-changer.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Consultant',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: 'The templates are gorgeous and so easy to customize. I get compliments from clients all the time!',
  },
];

const companies = ['Spotify', 'Slack', 'Dropbox', 'Airbnb', 'Stripe'];

const Testimonials = () => {
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
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Loved by businesses worldwide
          </h2>
          <p className="text-lg text-slate-600">
            See what our customers have to say about their experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {testimonials.map(({ name, role, image, content }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow hover:shadow-lg transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-slate-700 mb-6 text-lg">"{content}"</p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={image}
                  alt={name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-200 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{name}</h4>
                  <p className="text-sm text-slate-500">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Companies Trusted Section */}
        <motion.div
          className="mt-20 pt-16 border-t border-slate-200"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-center text-slate-400 mb-8 font-medium">
            Trusted by companies worldwide
          </p>
          <motion.div className="flex flex-wrap justify-center items-center gap-12">
            {companies.map((company) => (
              <motion.span
                key={company}
                variants={fadeUp}
                className="text-2xl font-bold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {company}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
