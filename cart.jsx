
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cartVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
};

export default function Cart({ cartItems, onClose, onUpdateQuantity, onCheckout }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <motion.div
        className="relative w-full max-w-md bg-white flex flex-col"
        variants={cartVariants}
      >
        <header className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            Your Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <p>Your cart is empty.</p>
              <p className="text-sm">Time to go shopping!</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4"/>
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>
                        <Plus className="h-4 w-4"/>
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => onUpdateQuantity(item.id, 0)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg font-bold" onClick={onCheckout}>
              Proceed to Checkout
            </Button>
          </footer>
        )}
      </motion.div>
    </motion.div>
  );
}
