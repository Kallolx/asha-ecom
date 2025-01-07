import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#000000',
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for adding new category
  const handleAddNew = () => {
    setModalMode('add');
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#000000',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing category
  const handleEdit = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#000000',
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        // Add new category
        const docRef = await addDoc(collection(db, 'categories'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
        
        setCategories(prev => [...prev, { id: docRef.id, ...formData }]);
        toast.success('Category added successfully');
      } else {
        // Update existing category
        await updateDoc(doc(db, 'categories', selectedCategory.id), formData);
        
        setCategories(prev => prev.map(cat => 
          cat.id === selectedCategory.id ? { ...cat, ...formData } : cat
        ));
        toast.success('Category updated successfully');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  // Handle category deletion
  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FiPlus className="mr-2 -ml-1 h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {category.icon && (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <span className="text-xl" style={{ color: category.color }}>
                      {category.icon}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-gray-500">{category.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-30"></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                    Icon (emoji or icon class)
                  </label>
                  <input
                    type="text"
                    name="icon"
                    id="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <input
                    type="color"
                    name="color"
                    id="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {modalMode === 'add' ? 'Add Category' : 'Save Changes'}
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

export default Categories; 