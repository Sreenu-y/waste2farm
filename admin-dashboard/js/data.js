/**
 * Mock data for the admin dashboard
 * In production, this would come from the API
 */

const MOCK_USERS = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@hotel.com', role: 'generator', city: 'Hyderabad', orders: 45, rating: 4.8, isActive: true },
  { id: '2', name: 'Lakshmi Farms', email: 'lakshmi@farms.com', role: 'buyer', city: 'Hyderabad', orders: 32, rating: 4.9, isActive: true },
  { id: '3', name: 'Raju K.', email: 'raju@driver.com', role: 'driver', city: 'Hyderabad', orders: 78, rating: 4.7, isActive: true },
  { id: '4', name: 'Green Market', email: 'info@greenmarket.com', role: 'generator', city: 'Bangalore', orders: 23, rating: 4.5, isActive: true },
  { id: '5', name: 'BioPower Plant', email: 'ops@biopower.com', role: 'buyer', city: 'Mumbai', orders: 56, rating: 4.6, isActive: true },
  { id: '6', name: 'Sita Devi', email: 'sita@compost.com', role: 'buyer', city: 'Delhi', orders: 12, rating: 4.3, isActive: false },
  { id: '7', name: 'Vijay Transport', email: 'vijay@transport.com', role: 'driver', city: 'Chennai', orders: 91, rating: 4.9, isActive: true },
  { id: '8', name: 'Hotel Taj Palace', email: 'waste@tajpalace.com', role: 'generator', city: 'Mumbai', orders: 67, rating: 4.8, isActive: true },
  { id: '9', name: 'Organic Farms Co.', email: 'buy@organicfarms.com', role: 'buyer', city: 'Bangalore', orders: 41, rating: 4.7, isActive: true },
  { id: '10', name: 'Amit Logistics', email: 'amit@logistics.com', role: 'driver', city: 'Delhi', orders: 53, rating: 4.4, isActive: true },
];

const MOCK_ORDERS = [
  { id: 'W2F-8472', buyer: 'Lakshmi Farms', generator: 'Hotel Taj Palace', driver: 'Raju K.', type: 'Food', qty: '40 kg', amount: '₹1,200', status: 'delivered', city: 'Hyderabad', date: '2026-03-11' },
  { id: 'W2F-8471', buyer: 'BioPower Plant', generator: 'Green Market', driver: 'Vijay Transport', type: 'Vegetable', qty: '120 kg', amount: '₹3,600', status: 'in_transit', city: 'Mumbai', date: '2026-03-11' },
  { id: 'W2F-8470', buyer: 'Organic Farms Co.', generator: 'Rajesh Kumar', driver: 'Amit Logistics', type: 'Fruit', qty: '60 kg', amount: '₹1,800', status: 'picked_up', city: 'Bangalore', date: '2026-03-10' },
  { id: 'W2F-8469', buyer: 'Sita Devi', generator: 'Hotel Taj Palace', driver: '—', type: 'Food', qty: '25 kg', amount: '₹750', status: 'pending', city: 'Delhi', date: '2026-03-10' },
  { id: 'W2F-8468', buyer: 'Lakshmi Farms', generator: 'Green Market', driver: 'Raju K.', type: 'Garden', qty: '200 kg', amount: '₹4,000', status: 'completed', city: 'Hyderabad', date: '2026-03-09' },
  { id: 'W2F-8467', buyer: 'BioPower Plant', generator: 'Rajesh Kumar', driver: 'Vijay Transport', type: 'Dairy', qty: '80 kg', amount: '₹2,400', status: 'completed', city: 'Chennai', date: '2026-03-09' },
  { id: 'W2F-8466', buyer: 'Organic Farms Co.', generator: 'Hotel Taj Palace', driver: 'Amit Logistics', type: 'Mixed', qty: '150 kg', amount: '₹3,000', status: 'completed', city: 'Mumbai', date: '2026-03-08' },
];

const MOCK_LISTINGS = [
  { id: '1', type: 'vegetable', title: 'Fresh Vegetable Waste', generator: 'Green Market', qty: '50 kg', price: '₹200', city: 'Hyderabad', status: 'available' },
  { id: '2', type: 'food', title: 'Cooked Food Waste', generator: 'Hotel Taj Palace', qty: '40 kg', price: '₹160', city: 'Mumbai', status: 'available' },
  { id: '3', type: 'fruit', title: 'Ripe Fruit Waste', generator: 'Rajesh Kumar', qty: '30 kg', price: '₹150', city: 'Bangalore', status: 'sold' },
  { id: '4', type: 'garden', title: 'Garden Trimmings', generator: 'Park Authority', qty: '200 kg', price: '₹400', city: 'Delhi', status: 'available' },
  { id: '5', type: 'dairy', title: 'Expired Dairy Products', generator: 'Dairy Fresh', qty: '25 kg', price: '₹100', city: 'Chennai', status: 'expired' },
  { id: '6', type: 'grain', title: 'Grain Husk & Waste', generator: 'Mill Works', qty: '500 kg', price: '₹1,500', city: 'Hyderabad', status: 'available' },
];

const MOCK_CITIES = [
  { name: 'Hyderabad', status: 'active', users: 4200, orders: 2800, waste: '45 tons', revenue: '₹8.2L' },
  { name: 'Bangalore', status: 'active', users: 3100, orders: 2100, waste: '38 tons', revenue: '₹6.5L' },
  { name: 'Mumbai', status: 'active', users: 2800, orders: 1900, waste: '32 tons', revenue: '₹5.1L' },
  { name: 'Delhi', status: 'active', users: 1500, orders: 900, waste: '22 tons', revenue: '₹2.8L' },
  { name: 'Chennai', status: 'active', users: 1247, orders: 642, waste: '19 tons', revenue: '₹1.9L' },
  { name: 'Pune', status: 'upcoming', users: 0, orders: 0, waste: '0 tons', revenue: '₹0' },
];

const CHART_MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const CHART_DATA = {
  orders: [820, 1050, 1380, 1620, 1890, 2340],
  revenue: [210000, 280000, 350000, 420000, 510000, 645000],
  wasteCollected: [12, 18, 24, 28, 35, 42],
  carbonSaved: [6, 9, 12, 14, 17.5, 21],
  wasteTypes: { vegetable: 35, fruit: 20, food: 25, garden: 10, dairy: 5, other: 5 },
};
