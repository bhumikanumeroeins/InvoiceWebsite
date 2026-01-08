import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const faqs = [
  {
    question: 'What is InvoicePro?',
    answer: 'InvoicePro is a professional invoicing platform that helps businesses create, manage, and send invoices, quotes, receipts, and other financial documents quickly and easily.'
  },
  {
    question: 'Is InvoicePro free to use?',
    answer: 'Yes! We offer a free plan that allows you to create up to 5 invoices per month. For unlimited invoices and premium features, check out our Pro and Enterprise plans.'
  },
  {
    question: 'Can I customize my invoices?',
    answer: 'Absolutely! You can add your company logo, customize colors, add payment information, QR codes for payments, multiple terms and conditions, and choose from various document types.'
  },
  {
    question: 'What document types can I create?',
    answer: 'InvoicePro supports Invoice, Tax Invoice, Proforma Invoice, Receipt, Sales Receipt, Cash Receipt, Quote, Estimate, Credit Memo, Credit Note, Purchase Order, and Delivery Note.'
  },
  {
    question: 'Can I add taxes to my invoices?',
    answer: 'Yes! You can add multiple tax types (GST, CGST, SGST, VAT, etc.) with custom rates. Taxes are saved for future use and can be applied to individual line items.'
  },
  {
    question: 'How do I add a payment QR code?',
    answer: 'In the invoice form, scroll to the bottom and you\'ll find a "Scan to Pay" section where you can upload your UPI or payment QR code image.'
  },
  {
    question: 'Can I save items for reuse?',
    answer: 'Yes! You can save frequently used items to your library and quickly add them to new invoices using the "Add Saved Items" button.'
  },
  {
    question: 'What currencies are supported?',
    answer: 'We support INR, USD, EUR, GBP, AUD, CAD, SGD, AED, JPY, and CNY. You can select your preferred currency from the dropdown in the invoice form.'
  },
  {
    question: 'Can I add my signature to invoices?',
    answer: 'Yes! You can upload a signature image or draw your signature directly in the app. The signature will appear on your generated invoices.'
  },
  {
    question: 'Is my data secure?',
    answer: 'We take security seriously. All data is encrypted in transit and at rest. We never share your information with third parties.'
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden">
    <button
      onClick={onClick}
      className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
    >
      <span className="font-medium text-slate-800">{question}</span>
      {isOpen ? (
        <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
      )}
    </button>
    {isOpen && (
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <p className="text-slate-600">{answer}</p>
      </div>
    )}
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-300">
            Find answers to common questions about InvoicePro
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 text-center p-8 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-4">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
