import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Template1 from '../templates/Template1';
import Template2 from '../templates/Template2';
import Template3 from '../templates/Template3';
import Template4 from '../templates/Template4';
import Template5 from '../templates/Template5';

const templates = [
  { id: 165, title: 'In Neat', src: 'https://templates.invoicehome.com/invoice-template-in-neat-750px.png' },
  { id: 1, title: 'Classic White', src: 'https://templates.invoicehome.com/invoice-template-in-classic-white-750px.png' },
  { id: 88, title: 'Band Blue', src: 'https://templates.invoicehome.com/invoice-template-in-band-blue-750px.png' },
  { id: 164, title: 'Military Orange', src: 'https://templates.invoicehome.com/invoice-template-in-military-orange-750px.png' },
  { id: 178, title: 'Flag Of India', src: 'https://templates.invoicehome.com/invoice-template-in-flag-of-india-750px.png' },
  { id: 3, title: 'Modern Red', src: 'https://templates.invoicehome.com/invoice-template-in-modern-red-750px.png' },
  { id: 206, title: 'Cool Waves', src: 'https://templates.invoicehome.com/invoice-template-in-cool-waves-750px.png' },
  { id: 297, title: 'Dexter', src: 'https://templates.invoicehome.com/invoice-template-in-dexter-750px.png' },
  { id: 87, title: 'Mono Black', src: 'https://templates.invoicehome.com/invoice-template-in-mono-black-750px.png' },
  { id: 39, title: 'Oldie', src: 'https://templates.invoicehome.com/invoice-template-in-oldie-750px.png' },
  { id: 4, title: 'Classic Blue', src: 'https://templates.invoicehome.com/invoice-template-in-classic-blue-750px.png' },
  { id: 215, title: 'Connect Rbw', src: 'https://templates.invoicehome.com/invoice-template-in-connect-rbw-750px.png' },
];

const Templates = () => {
  // Variants for animation
  const fadeUp = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }, // stagger each template
  };

  return (
    <section id="templates" className="py-28 bg-slate-50">
      <div className="text-center max-w-3xl mx-auto mb-20 px-6">
        <motion.span
          className="text-indigo-600 font-semibold text-sm uppercase tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Templates
        </motion.span>

        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          Beautiful Invoice Templates
        </motion.h2>

        <motion.p
          className="text-lg text-slate-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          viewport={{ once: true }}
        >
          Choose from our collection of professionally designed templates. Customize to match your brand.
        </motion.p>
      </div>

      {/* Custom Templates Grid */}
      <motion.div
        className="flex justify-center gap-6 px-6 mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Template 1 - Cyber Pink */}
        <motion.div
          className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-[1.02] cursor-pointer bg-white"
          style={{ width: '220px', height: '311px' }}
          variants={fadeUp}
        >
          <div style={{ transform: 'scale(0.278)', transformOrigin: 'top left', width: '210mm', height: '297mm' }}>
            <Template1 />
          </div>
        </motion.div>

        {/* Template 2 - Colorful Modern */}
        <motion.div
          className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-[1.02] cursor-pointer bg-white"
          style={{ width: '220px', height: '311px' }}
          variants={fadeUp}
        >
          <div style={{ transform: 'scale(0.278)', transformOrigin: 'top left', width: '210mm', height: '297mm' }}>
            <Template2 />
          </div>
        </motion.div>

        {/* Template 3 - Geometric */}
        <motion.div
          className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-[1.02] cursor-pointer bg-white"
          style={{ width: '220px', height: '311px' }}
          variants={fadeUp}
        >
          <div style={{ transform: 'scale(0.278)', transformOrigin: 'top left', width: '210mm', height: '297mm' }}>
            <Template3 />
          </div>
        </motion.div>

        {/* Template 4 - Colorful Circles */}
        <motion.div
          className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-[1.02] cursor-pointer bg-white"
          style={{ width: '220px', height: '311px' }}
          variants={fadeUp}
        >
          <div style={{ transform: 'scale(0.278)', transformOrigin: 'top left', width: '210mm', height: '297mm' }}>
            <Template4 />
          </div>
        </motion.div>

        {/* Template 5 - Purple Wave */}
        <motion.div
          className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-[1.02] cursor-pointer bg-white"
          style={{ width: '220px', height: '311px' }}
          variants={fadeUp}
        >
          <div style={{ transform: 'scale(0.278)', transformOrigin: 'top left', width: '210mm', height: '297mm' }}>
            <Template5 />
          </div>
        </motion.div>
      </motion.div>

      {/* External Templates Grid – 4 per row */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {templates.map((template) => (
          <motion.a
            key={template.id}
            href={`/invoice/new?invoice_template_id=${template.id}`}
            className="block shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105"
            title={`Invoice Template In ${template.title}`}
            variants={fadeUp} // fade and scale in each template sequentially
          >
            <img
              src={template.src}
              alt={`Invoice Template In ${template.title}`}
              className="w-full h-auto object-contain"
            />
          </motion.a>
        ))}
      </motion.div>

      {/* CTA Button – Optional */}
      {/* <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all">
          View All 100+ Templates
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div> */}
    </section>
  );
};

export default Templates;
