import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Templates from '../components/home/Templates';
import Testimonials from '../components/home/Testimonials';
import Pricing from '../components/home/Pricing';
import CTA from '../components/home/CTA';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Templates />
      <Pricing />
      <Testimonials />
      <CTA />
    </Layout>
  );
};

export default Home;
