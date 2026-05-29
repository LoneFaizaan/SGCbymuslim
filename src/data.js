// Approximate live gold rate per gram (INR) for estimation purposes
export const GOLD_RATES = {
  '24K': 7550, // 99.9% pure
  '22K': 6920, // 91.6% pure
  '18K': 5660, // 75.0% pure
  '14K': 4400, // 58.3% pure
};

export const CATERING_MENU_ITEMS = [
  // Appetizers
  {
    id: 'app-1',
    name: 'Kashmiri Mutton Seekh Kabab',
    category: 'appetizers',
    pricePerPerson: 180,
    description: 'Skewered lamb mince prepared with local spices and saffron.',
  },
  {
    id: 'app-2',
    name: 'Crispy Veg Spring Rolls',
    category: 'appetizers',
    pricePerPerson: 100,
    description: 'Hand-rolled light pastry filled with fresh julienned seasonal vegetables.',
  },
  {
    id: 'app-3',
    name: 'Honey Chilli Paneer Bites',
    category: 'appetizers',
    pricePerPerson: 120,
    description: 'Golden fried paneer cubes tossed in sweet and spicy glazed honey sauce.',
  },
  {
    id: 'app-4',
    name: 'Saffron Nadru Shammi',
    category: 'appetizers',
    pricePerPerson: 140,
    description: 'Lotus stem patties infused with traditional ginger and fennel spices.',
  },

  // Mains
  {
    id: 'main-1',
    name: 'Kashmiri Gushtaba (Wazwan Classic)',
    category: 'mains',
    pricePerPerson: 350,
    description: 'Velvety, hand-pounded lamb meatballs simmered in a rich, spiced curd gravy.',
  },
  {
    id: 'main-2',
    name: 'Kashmiri Rogan Josh',
    category: 'mains',
    pricePerPerson: 300,
    description: 'Tender mutton cooked in an authentic aromatic Kashmiri red chilli and fennel gravy.',
  },
  {
    id: 'main-3',
    name: 'Imperial Saffron Biryani',
    category: 'mains',
    pricePerPerson: 220,
    description: 'Fragrant long-grain basmati rice layered with aromatic spices and saffron.',
  },
  {
    id: 'main-4',
    name: 'Paneer Makhani Lababdar',
    category: 'mains',
    pricePerPerson: 180,
    description: 'Fresh cottage cheese triangles in a creamy premium butter tomato reduction.',
  },
  {
    id: 'main-5',
    name: 'Dum Aloo Kashmiri',
    category: 'mains',
    pricePerPerson: 150,
    description: 'Deep-fried baby potatoes slow-cooked in spicy yogurt gravy, classic style.',
  },

  // Desserts
  {
    id: 'des-1',
    name: 'Saffron Phirni',
    category: 'desserts',
    pricePerPerson: 90,
    description: 'Creamy slow-cooked ground rice pudding flavored with green cardamom and pure saffron.',
  },
  {
    id: 'des-2',
    name: 'Hot Gulab Jamun with Rabri',
    category: 'desserts',
    pricePerPerson: 80,
    description: 'Golden syrup-soaked berry-sized milk dumplings paired with chilled reduced milk.',
  },
  {
    id: 'des-3',
    name: 'Kulfi Falooda Sundae',
    category: 'desserts',
    pricePerPerson: 110,
    description: 'Rich pistachio kulfi served with sweet cornstarch vermicelli and rose syrup.',
  },

  // Beverages
  {
    id: 'bev-1',
    name: 'Traditional Saffron Kehwa',
    category: 'beverages',
    pricePerPerson: 60,
    description: 'Authentic green tea brewed with saffron, cinnamon, cardamoms, and slivered almonds.',
  },
  {
    id: 'bev-2',
    name: 'Mint & Cucumber Lemonade',
    category: 'beverages',
    pricePerPerson: 70,
    description: 'Chilled muddled summer mint and cucumber ribbons with freshly squeezed lemon juice.',
  },
  {
    id: 'bev-3',
    name: 'Royal Mango Lassi',
    category: 'beverages',
    pricePerPerson: 80,
    description: 'Thick churned yogurt smoothie blended with ripe sweet Alphonso mango pulp.',
  },
];

export const REAL_ESTATE_LISTINGS = [
  {
    id: 'prop-1',
    title: 'SGC Commercial Complex Space',
    type: 'Commercial',
    price: '₹1.85 Cr',
    priceNum: 18500000,
    location: 'Lal Chowk, Srinagar, J&K',
    bedrooms: undefined,
    bathrooms: 2,
    area: '2,400 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    featured: true,
    tag: 'Premium Commercial',
  },
  {
    id: 'prop-2',
    title: 'Overlook Premium Royal Villa',
    type: 'Residential Sale',
    price: '₹3.40 Cr',
    priceNum: 34000000,
    location: 'Nishat, Srinagar, J&K (Near Dal Lake)',
    bedrooms: 5,
    bathrooms: 6,
    area: '4,800 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    featured: true,
    tag: 'Hot Deal',
  },
  {
    id: 'prop-3',
    title: 'Scenic Luxury 3BHK Apartment',
    type: 'Residential Rental',
    price: '₹45,000 / month',
    priceNum: 45000,
    location: 'Rajbagh, Srinagar, J&K',
    bedrooms: 3,
    bathrooms: 3,
    area: '1,850 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600',
    featured: false,
    tag: 'Corporate Rent',
  },
  {
    id: 'prop-4',
    title: 'Prime Commercial Retail Showroom',
    type: 'Commercial',
    price: '₹1.20 Cr',
    priceNum: 12000000,
    location: 'Karan Nagar, Srinagar, J&K',
    bedrooms: undefined,
    bathrooms: 1,
    area: '1,100 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600',
    featured: false,
    tag: 'Retail Space',
  },
  {
    id: 'prop-5',
    title: 'Exclusive Residential Plot',
    type: 'Plot / Land',
    price: '₹95 Lakhs',
    priceNum: 9500000,
    location: 'Humhama, Srinagar, J&K (Near Airport Road)',
    bedrooms: undefined,
    bathrooms: undefined,
    area: '4,500 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    featured: false,
    tag: 'Premium Location',
  }
];
