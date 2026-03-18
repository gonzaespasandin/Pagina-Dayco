import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Reacondicionamiento from '../components/Reacondicionamiento';
import Nosotros from '../components/Nosotros';
import Casinos from '../components/Casinos';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductGrid />
      <Reacondicionamiento />
      <Nosotros />
      <Casinos />
      <Contacto />
      <Footer />
    </>
  );
}
export default Home;