
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      whileHover={{ scale: 1.03 }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-800">
          ${product.price.toFixed(2)}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 flex-grow">{product.description}</p>
        <p className="text-xs text-blue-600 font-medium mt-2">
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!`}
        </p>
        <Button
          onClick={() => onAddToCart(product, 1)}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
