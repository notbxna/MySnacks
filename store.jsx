
import React, { useState, useEffect } from "react";
import { Product } from "@/entities/Product";
import ProductCard from "../components/store/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function StorePage({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const allProducts = await Product.list("-created_date");
      setProducts(allProducts.filter(p => p.stock > 0));
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Your Daily Dose of Delicious
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          From crunchy to chewy, salty to sweet, find your perfect snack right here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
      </div>
    </div>
  );
}
