import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FiFilter } from 'react-icons/fi';
import ProductCard from '../components/ProductCard/ProductCard';
import toast from 'react-hot-toast';

const Products = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let productsQuery = collection(db, 'products');

        if (category) {
          productsQuery = query(productsQuery, where('category', '==', category));
        }

        if (subcategory) {
          productsQuery = query(productsQuery, where('subcategory', '==', subcategory));
        }

        const querySnapshot = await getDocs(productsQuery);
        let productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            productsData.sort((a, b) => 
              Math.min(...(a.packages?.map(p => p.price) || [a.price])) - 
              Math.min(...(b.packages?.map(p => p.price) || [b.price]))
            );
            break;
          case 'price-high':
            productsData.sort((a, b) => 
              Math.max(...(b.packages?.map(p => p.price) || [b.price])) - 
              Math.max(...(a.packages?.map(p => p.price) || [a.price]))
            );
            break;
          case 'newest':
            productsData.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
            break;
          default:
            // Featured sorting (default order)
            break;
        }

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory, sortBy]);

  return (
    <div className="max-w-md mx-auto px-2 py-3">
      {/* Header */}
      <div className="mb-3">
        <h1 className="text-lg font-bold text-gray-900">
          {subcategory || category || 'All Products'}
        </h1>
        <p className="text-[10px] text-gray-500">
          {products.length} products found
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 text-xs">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Products; 