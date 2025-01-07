import React, { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiPhone, FiCalendar, FiPackage } from 'react-icons/fi';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'customer'));
        const querySnapshot = await getDocs(q);
        const customersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomers(customersData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load customers');
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle customer status update
  const handleStatusUpdate = async (customerId, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', customerId), {
        status: newStatus
      });
      
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId ? { ...customer, status: newStatus } : customer
      ));
      
      toast.success('Customer status updated successfully');
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('Failed to update customer status');
    }
  };

  // View customer details
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {customer.name ? customer.name[0].toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.orders?.length || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={customer.status || 'active'}
                      onChange={(e) => handleStatusUpdate(customer.id, e.target.value)}
                      className="text-sm rounded-full px-3 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewDetails(customer)}
                      className="text-primary hover:text-primary-dark"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {isDetailsOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-30"></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="text-2xl font-medium">
                      {selectedCustomer.name ? selectedCustomer.name[0].toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                    <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <FiMail className="w-5 h-5" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <FiPhone className="w-5 h-5" />
                    <span>{selectedCustomer.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <FiCalendar className="w-5 h-5" />
                    <span>Joined {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <FiPackage className="w-5 h-5" />
                    <span>{selectedCustomer.orders?.length || 0} Orders</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Recent Orders</h4>
                  {selectedCustomer.orders?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCustomer.orders.slice(0, 3).map((order, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                            <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <span className="text-sm font-medium text-gray-900">${order.total}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No orders yet</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers; 