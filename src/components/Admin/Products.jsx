import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    deliveryTime: '',
    isPopular: false,
    isFarmFresh: false,
    category: '',
    subcategory: '',
    packages: [{ id: 1, name: '', price: 0, quantity: 1 }]
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      image: product.image,
      deliveryTime: product.deliveryTime,
      isPopular: product.isPopular,
      isFarmFresh: product.isFarmFresh,
      category: product.category,
      subcategory: product.subcategory,
      packages: product.packages || []
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      image: '',
      deliveryTime: '',
      isPopular: true,
      isFarmFresh: false,
      category: '',
      subcategory: '',
      packages: [{ id: 1, name: '', price: 0, quantity: 1 }]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing product
        await updateDoc(doc(db, 'products', editingProduct.id), formData);
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData } : p
        ));
        toast.success('Product updated successfully');
      } else {
        // Add new product
        const docRef = await addDoc(collection(db, 'products'), formData);
        setProducts([...products, { id: docRef.id, ...formData }]);
        toast.success('Product added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handlePackageChange = (index, field, value) => {
    const newPackages = [...formData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setFormData({ ...formData, packages: newPackages });
  };

  const addPackage = () => {
    const newId = Math.max(...formData.packages.map(p => p.id)) + 1;
    setFormData({
      ...formData,
      packages: [...formData.packages, { id: newId, name: '', price: 0, quantity: 1 }]
    });
  };

  const removePackage = (index) => {
    if (formData.packages.length > 1) {
      const newPackages = formData.packages.filter((_, i) => i !== index);
      setFormData({ ...formData, packages: newPackages });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              image: '',
              deliveryTime: '',
              isPopular: false,
              isFarmFresh: false,
              category: '',
              subcategory: '',
              packages: [{ id: 1, name: '', price: 0, quantity: 1 }]
            });
            setIsModalOpen(true);
          }}
          className="bg-[#2B7A0B] hover:bg-[#236209] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">Delivery in {product.deliveryTime}</div>
                      {/* Show category on mobile */}
                      <div className="text-xs text-gray-500 sm:hidden mt-1">
                        {product.category} - {product.subcategory}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-900">{product.category}</div>
                  <div className="text-sm text-gray-500">{product.subcategory}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {product.packages?.length > 0 ? (
                    <div className="text-sm text-gray-900">
                      ৳{Math.min(...product.packages.map(p => p.price))} - 
                      ৳{Math.max(...product.packages.map(p => p.price))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No packages</div>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {product.isPopular && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Popular
                      </span>
                    )}
                    {product.isFarmFresh && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        Farm Fresh
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {editingProduct ? 'Update the product information below' : 'Fill in the product information below'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Image Preview */}
                  <div className="lg:col-span-1">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 relative">
                          {formData.image ? (
                            <img 
                              src={formData.image} 
                              alt="Product preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              <div className="text-center">
                                <FiImage className="w-12 h-12 mx-auto mb-2" />
                                <span className="text-sm">No image preview</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          type="text"
                          required
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="Enter image URL"
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Product Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Section */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter product name"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                          <input
                            type="text"
                            required
                            value={formData.deliveryTime}
                            onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                            placeholder="e.g., 2-3 hours"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Enter category"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                          <input
                            type="text"
                            required
                            value={formData.subcategory}
                            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                            placeholder="Enter subcategory"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                          />
                        </div>
                      </div>

                      {/* Product Flags */}
                      <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            formData.isPopular ? 'bg-[#2B7A0B] border-[#2B7A0B]' : 'border-gray-300 group-hover:border-[#2B7A0B]'
                          }`}>
                            {formData.isPopular && <FiCheck className="w-4 h-4 text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={formData.isPopular}
                            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                          />
                          <span className="text-sm text-gray-700">Popular Product</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            formData.isFarmFresh ? 'bg-[#2B7A0B] border-[#2B7A0B]' : 'border-gray-300 group-hover:border-[#2B7A0B]'
                          }`}>
                            {formData.isFarmFresh && <FiCheck className="w-4 h-4 text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={formData.isFarmFresh}
                            onChange={(e) => setFormData({ ...formData, isFarmFresh: e.target.checked })}
                          />
                          <span className="text-sm text-gray-700">Farm Fresh</span>
                        </label>
                      </div>
                    </div>

                    {/* Packages Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Product Packages</h3>
                        <button
                          type="button"
                          onClick={addPackage}
                          className="text-sm text-[#2B7A0B] hover:text-[#236209] flex items-center gap-1"
                        >
                          <FiPlus className="w-4 h-4" /> Add Package
                        </button>
                      </div>
                      <div className="space-y-4">
                        {formData.packages.map((pkg, index) => (
                          <div 
                            key={pkg.id} 
                            className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm"
                          >
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                              <input
                                type="text"
                                required
                                value={pkg.name}
                                onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                                placeholder="e.g., Small Pack"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                              />
                            </div>
                            <div className="w-32">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                              <input
                                type="number"
                                required
                                value={pkg.price}
                                onChange={(e) => handlePackageChange(index, 'price', parseFloat(e.target.value))}
                                placeholder="0.00"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                              />
                            </div>
                            <div className="w-32">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                              <input
                                type="number"
                                required
                                value={pkg.quantity}
                                onChange={(e) => handlePackageChange(index, 'quantity', parseInt(e.target.value))}
                                placeholder="1"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2B7A0B] focus:ring-[#2B7A0B]"
                              />
                            </div>
                            {formData.packages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePackage(index)}
                                className="mt-7 p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#2B7A0B] hover:bg-[#236209] rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FiCheck className="w-4 h-4" /> {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 