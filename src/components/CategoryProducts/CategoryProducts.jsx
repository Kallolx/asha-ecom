import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../ProductCard/ProductCard';
import toast from 'react-hot-toast';

const CategoryProducts = () => {
  const { id: categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch category details
        const categoryRef = doc(db, 'categories', categoryId);
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
          setCategory({ id: categorySnap.id, ...categorySnap.data() });
        }

        // Fetch products in this category
        const productsQuery = query(
          collection(db, 'products'),
          where('category', '==', categoryId)
        );

        console.log('Fetching products for category:', categoryId);

        const productsSnapshot = await getDocs(productsQuery);
        
        console.log('Products found:', productsSnapshot.size);

        const productsData = productsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Product data:', data);
          return {
            id: doc.id,
            ...data
          };
        });

        // Sort products
        const sortedProducts = sortProducts(productsData, sortBy);
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching category products:', error);
        toast.error('Failed to load products');
      }
      setIsLoading(false);
    };

    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId, sortBy]);

  // Sort products based on selected criteria
  const sortProducts = (productsToSort, criteria) => {
    const sorted = [...productsToSort];
    switch (criteria) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price_asc':
        return sorted.sort((a, b) => 
          Math.min(...(a.packages?.map(p => p.price) || [a.price])) - 
          Math.min(...(b.packages?.map(p => p.price) || [b.price]))
        );
      case 'price_desc':
        return sorted.sort((a, b) => 
          Math.max(...(b.packages?.map(p => p.price) || [b.price])) - 
          Math.max(...(a.packages?.map(p => p.price) || [a.price]))
        );
      default:
        return sorted;
    }
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sortedProducts = sortProducts(products, newSortBy);
    setProducts(sortedProducts);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category?.name || 'Products'}</h1>
        {category?.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Filters and View Options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
          >
            <option value="name">Name</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length > 0 ? (
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6'
            : 'space-y-4'
          }
        `}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiFilter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or check back later for new products.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts; 