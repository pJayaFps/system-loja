import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <CategoryMenu />}
      <main className={`mx-auto max-w-7xl px-4 pb-6 ${isAdminRoute ? 'pt-8' : 'pt-32'} md:px-6`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/painel" element={<AdminPanelPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
