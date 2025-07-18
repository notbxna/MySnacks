
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Product } from "@/entities/Product";
import { Order } from "@/entities/Order";
import { Button } from "@/components/ui/button";
import Cart from "./components/store/Cart";
import { ShoppingCart, Store, ShieldCheck, Cookie } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);
  
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };
  
  const handleCheckout = async () => {
    const total_amount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderItems = cart.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    // Create the order
    await Order.create({ items: orderItems, total_amount });

    // Update stock for each product
    for (const item of cart) {
        const newStock = item.stock - item.quantity;
        await Product.update(item.id, { stock: newStock });
    }

    // Clear cart and close
    setCart([]);
    setIsCartOpen(false);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "Store", href: createPageUrl("Store"), icon: Store },
  ];
  if (user?.role === 'admin') {
      navLinks.push({ name: "Control Panel", href: createPageUrl("ControlPanel"), icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        :root {
          --primary-green: 34, 197, 94;
          --primary-orange: 249, 115, 22;
          --primary-blue: 59, 130, 246;
        }
      `}</style>
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl("Store")} className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <Cookie className="h-7 w-7 text-green-600" />
              Snack Shack
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map(link => (
                    <Link
                        key={link.name}
                        to={link.href}
                        className={`text-sm font-medium transition-colors ${location.pathname === link.href ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                    >
                        {link.name}
                    </Link>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-green-600 hover:bg-green-50"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {children ? React.cloneElement(children, { addToCart }) : null}
      </main>
      
      <AnimatePresence>
        {isCartOpen && (
            <Cart 
                cartItems={cart}
                onClose={() => setIsCartOpen(false)}
                onUpdateQuantity={updateCartQuantity}
                onCheckout={handleCheckout}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
