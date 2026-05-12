import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <CartDrawer />
    </>
  );
}
