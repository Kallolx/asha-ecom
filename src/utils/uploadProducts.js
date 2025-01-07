import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import toast from 'react-hot-toast';

const products = [
  {
    name: 'Farm Fresh Eggs',
    image: '/products/eggs.jpg',
    deliveryTime: '2-3 hours',
    isPopular: true,
    isFarmFresh: true,
    category: 'fresh-farm',
    subcategory: 'fresh-eggs',
    packages: [
      { id: 1, name: '4 Piece Pack', price: 52, quantity: 4 },
      { id: 2, name: '12 Pack', price: 135, quantity: 12 },
      { id: 3, name: 'Wholesale Pack', price: 320, quantity: 30 }
    ]
  },
  {
    name: 'Organic Fresh Milk',
    image: '/products/milk.jpg',
    deliveryTime: '2-3 hours',
    isPopular: true,
    isFarmFresh: true,
    category: 'fresh-farm',
    subcategory: 'fresh-milk',
    packages: [
      { id: 1, name: '500ml Pack', price: 45.00, quantity: 1 },
      { id: 2, name: '1L Pack', price: 85.00, quantity: 1 },
      { id: 3, name: 'Wholesale 5L', price: 400.00, quantity: 1 }
    ]
  },
  {
    name: 'Fresh Bread Loaf',
    image: '/products/bread.jpg',
    deliveryTime: '1-2 hours',
    isPopular: true,
    isFarmFresh: false,
    category: 'bakery',
    subcategory: 'fresh-breads',
    packages: [
      { id: 1, name: 'Single Loaf', price: 65.00, quantity: 1 },
      { id: 2, name: '2 Pack', price: 120.00, quantity: 2 },
      { id: 3, name: 'Family Pack', price: 280.00, quantity: 5 }
    ]
  },
  {
    name: 'Ghee Toast',
    image: '/products/toast.jpg',
    deliveryTime: '2-3 hours',
    isPopular: true,
    isFarmFresh: false,
    category: 'bakery',
    subcategory: 'toast-buns',
    packages: [
      { id: 1, name: '250g Pack', price: 40.00, quantity: 1 },
      { id: 2, name: '500g Pack', price: 75.00, quantity: 1 },
      { id: 3, name: '1kg Pack', price: 140.00, quantity: 1 }
    ]
  },
  {
    name: 'Butter Bun',
    image: '/products/butter.jpg',
    deliveryTime: '2-3 hours',
    isPopular: true,
    isFarmFresh: false,
    category: 'bakery',
    subcategory: 'toast-buns',
    packages: [
      { id: 1, name: '1 Pack', price: 10.00, quantity: 1 },
      { id: 2, name: '5 Pack', price: 45.00, quantity: 1 },
      { id: 3, name: '10 Pack', price: 90.00, quantity: 1 }
    ]
  },
  {
    name: 'Butter Cookies',
    image: '/products/cook.jpg',
    deliveryTime: '2-3 hours',
    isPopular: true,
    isFarmFresh: false,
    category: 'bakery',
    subcategory: 'cookies-biscuits',
    packages: [
      { id: 1, name: '250g Pack', price: 35.00, quantity: 1 },
      { id: 2, name: '500g Pack', price: 60.00, quantity: 1 },
      { id: 3, name: '1kg Pack', price: 110.00, quantity: 1 }
    ]
  }
];

const getBase64FromImage = async (imagePath) => {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imagePath}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error.message}`);
  }
};

export const uploadProducts = async () => {
  try {
    // Check if products already exist
    const productsRef = collection(db, 'products');
    const existingProducts = await getDocs(
      query(productsRef, where('isPopular', '==', true))
    );

    if (!existingProducts.empty) {
      toast.error('Products already exist in Firestore');
      return;
    }

    // Show upload starting toast
    toast.loading('Starting product upload...', { id: 'upload' });

    // Upload products
    for (const product of products) {
      try {
        // Update progress toast
        toast.loading(`Processing ${product.name}...`, { id: 'upload' });

        // Convert image to base64
        const base64Image = await getBase64FromImage(product.image);

        // Add product to Firestore
        const productData = {
          ...product,
          image: base64Image,
          createdAt: new Date()
        };

        await addDoc(collection(db, 'products'), productData);
        
        // Show success toast for each product
        toast.success(`Added ${product.name}`, { id: 'upload' });
      } catch (error) {
        console.error(`Error uploading ${product.name}:`, error);
        toast.error(`Failed to upload ${product.name}: ${error.message}`);
        // Continue with next product
        continue;
      }
    }

    // Show final success toast
    toast.success('All products uploaded successfully', { id: 'upload' });
  } catch (error) {
    console.error('Error uploading products:', error);
    toast.error(`Upload failed: ${error.message}`, { id: 'upload' });
  }
}; 