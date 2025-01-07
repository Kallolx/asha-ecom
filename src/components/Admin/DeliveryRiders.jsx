import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiTruck, FiCheck, FiPhone, FiX, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DeliveryRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);
  const [riderStats, setRiderStats] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    status: 'active',
    vehicleType: 'motorcycle',
    vehicleNumber: '',
    role: 'rider'
  });

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      const ridersRef = collection(db, 'users');
      const q = query(ridersRef, where('role', '==', 'rider'));
      const querySnapshot = await getDocs(q);
      
      const ridersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRiders(ridersData);
      
      // Fetch stats for each rider
      const stats = {};
      for (const rider of ridersData) {
        const riderStats = await fetchRiderStats(rider.id);
        stats[rider.id] = riderStats;
      }
      setRiderStats(stats);
    } catch (error) {
      console.error('Error fetching riders:', error);
      toast.error('Failed to fetch riders');
    } finally {
      setLoading(false);
    }
  };

  const fetchRiderStats = async (riderId) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('riderId', '==', riderId),
        where('status', 'in', ['delivered', 'processing'])
      );
      const querySnapshot = await getDocs(q);
      
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return {
        totalDeliveries: orders.filter(order => order.status === 'delivered').length,
        inProgress: orders.filter(order => order.status === 'processing').length,
        todayDeliveries: orders.filter(order => {
          if (!order.deliveredAt || order.status !== 'delivered') return false;
          const deliveryDate = new Date(order.deliveredAt);
          return deliveryDate.getDate() === today.getDate() &&
                 deliveryDate.getMonth() === today.getMonth() &&
                 deliveryDate.getFullYear() === today.getFullYear();
        }).length
      };
    } catch (error) {
      console.error('Error fetching rider stats:', error);
      return { totalDeliveries: 0, inProgress: 0, todayDeliveries: 0 };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedRider) {
        // Update existing rider
        await updateDoc(doc(db, 'users', selectedRider.id), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        toast.success('Rider updated successfully');
      } else {
        // Add new rider
        const riderData = {
          ...formData,
          createdAt: new Date().toISOString(),
          role: 'rider'
        };
        await addDoc(collection(db, 'users'), riderData);
        toast.success('Rider added successfully');
      }
      
      setIsModalOpen(false);
      fetchRiders();
    } catch (error) {
      console.error('Error saving rider:', error);
      toast.error('Failed to save rider');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (riderId) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      try {
        // Check if rider has any active deliveries
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('riderId', '==', riderId), where('status', '==', 'processing'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          toast.error('Cannot delete rider with active deliveries');
          return;
        }

        await deleteDoc(doc(db, 'users', riderId));
        setRiders(riders.filter(rider => rider.id !== riderId));
        toast.success('Rider deleted successfully');
      } catch (error) {
        console.error('Error deleting rider:', error);
        toast.error('Failed to delete rider');
      }
    }
  };

  const handleStatusToggle = async (riderId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'users', riderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setRiders(riders.map(rider => 
        rider.id === riderId ? { ...rider, status: newStatus } : rider
      ));
      
      toast.success(`Rider ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating rider status:', error);
      toast.error('Failed to update rider status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Riders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your delivery personnel
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedRider(null);
            setFormData({
              name: '',
              phone: '',
              email: '',
              area: '',
              status: 'active',
              vehicleType: 'motorcycle',
              vehicleNumber: '',
              role: 'rider'
            });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Add New Rider
        </button>
      </div>

      {riders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiTruck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No riders</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new rider.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {riders.map((rider) => (
            <div key={rider.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{rider.name}</h3>
                  <p className="text-sm text-gray-500">{rider.area}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedRider(rider);
                      setFormData({
                        name: rider.name,
                        phone: rider.phone,
                        email: rider.email || '',
                        area: rider.area,
                        status: rider.status,
                        vehicleType: rider.vehicleType,
                        vehicleNumber: rider.vehicleNumber,
                        role: 'rider'
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rider.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Total Deliveries</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {riderStats[rider.id]?.totalDeliveries || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Today's Deliveries</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {riderStats[rider.id]?.todayDeliveries || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                  <a href={`tel:${rider.phone}`} className="text-primary hover:text-primary-dark">
                    {rider.phone}
                  </a>
                </div>
                {rider.email && (
                  <div className="flex items-center text-sm">
                    <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{rider.email}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <FiTruck className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{rider.vehicleType} - {rider.vehicleNumber}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiPackage className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {riderStats[rider.id]?.inProgress || 0} orders in progress
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <button
                    onClick={() => handleStatusToggle(rider.id, rider.status)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rider.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {rider.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Rider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedRider ? 'Edit Rider' : 'Add New Rider'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="car">Car</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {selectedRider ? 'Update Rider' : 'Add Rider'}
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

export default DeliveryRiders; 