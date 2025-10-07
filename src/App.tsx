
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminPage from "./pages/AdminPage";
import CustomizationPage from "./pages/CustomizationPage";
import RequestProductPage from "./pages/RequestProductPage";
import ShoppingCart from "./components/ShoppingCart";
import CheckoutPage from "./components/CheckoutPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import { BackToTop } from "./components/BackToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/customize" element={<CustomizationPage />} />
              <Route path="/request-product" element={<RequestProductPage />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              {/* Policy and Contact Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsAndConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <BackToTop />
          </BrowserRouter>
        </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
