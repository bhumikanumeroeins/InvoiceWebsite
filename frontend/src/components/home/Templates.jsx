import { motion } from 'framer-motion';

import img1 from '../../assets/templates/images/1.jpg';
import img2 from '../../assets/templates/images/2.jpg';
import img3 from '../../assets/templates/images/3.png';
import img4 from '../../assets/templates/images/4.jpg';
import img5 from '../../assets/templates/images/5.jpg';
import img6 from '../../assets/templates/images/6.jpg';
import img7 from '../../assets/templates/images/7.png';
import img8 from '../../assets/templates/images/8.jpg';
import img9 from '../../assets/templates/images/9.jpg';
import img10 from '../../assets/templates/images/10.jpg';
import img11 from '../../assets/templates/images/11.jpg';
import img12 from '../../assets/templates/images/12.png';

const templates = [
  { id: 1, title: 'Template 1', src: img1 },
  { id: 2, title: 'Template 2', src: img2 },
  { id: 3, title: 'Template 3', src: img3 },
  { id: 4, title: 'Template 4', src: img4 },
  { id: 5, title: 'Template 5', src: img5 },
  { id: 6, title: 'Template 6', src: img6 },
  { id: 7, title: 'Template 7', src: img7 },
  { id: 8, title: 'Template 8', src: img8 },
  { id: 9, title: 'Template 9', src: img9 },
  { id: 10, title: 'Template 10', src: img10 },
  { id: 11, title: 'Template 11', src: img11 },
  { id: 12, title: 'Template 12', src: img12 },
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

      {/* Custom preview removed — using local image grid below */}

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
            className="block shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105 bg-white"
            title={template.title}
            variants={fadeUp}
          >
            <div className="w-full aspect-[3/4] bg-slate-100 flex items-center justify-center">
              <img
                src={template.src}
                alt={template.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

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
