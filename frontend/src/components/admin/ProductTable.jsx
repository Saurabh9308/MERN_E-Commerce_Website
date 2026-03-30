// ProductTable.jsx (updated with Add Product functionality)
import React, { useState } from 'react';
import { Trash2, Edit, Plus, Search, Filter, Shirt, Tag } from 'lucide-react';
import AddProduct from './AddProduct';

const ProductTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([
    // Your existing products data here
    {
      id: "prod-026",
      name: "Black Chevron Designer Kurta",
      brand: "Riwayat",
      price: 2899,
      mrp: 5999,
      description: "Contemporary black kurta featuring a stylish chevron woven pattern in premium jacquard silk blend.",
      category: "Men",
      subCategory: "Kurtas",
      fabric: "Jacquard Silk Blend",
      images: ["/images/black_chevron_kurta_01.jpeg"],
      variants: [
        {
          color: "Black",
          sizes: [
            { size: "S", stock: 8 },
            { size: "M", stock: 17 },
            { size: "L", stock: 14 },
            { size: "XL", stock: 9 }
          ]
        }
      ],
      tags: ["Ethnic", "Kurta", "Designer", "Premium"],
      fit: "Slim Fit",
      isFeatured: true
    },
    // ... other products
  ]);

  // Handle adding new product
  const handleAddProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setShowAddProduct(false);
  };

  // Calculate total stock across all variants
  const calculateTotalStock = (variants) => {
    return variants.reduce((total, variant) => {
      const variantStock = variant.sizes.reduce((sum, size) => sum + size.stock, 0);
      return total + variantStock;
    }, 0);
  };

  // Calculate discount percentage
  const calculateDiscount = (price, mrp) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  // Get stock status
  const getStockStatus = (variants) => {
    const totalStock = calculateTotalStock(variants);
    if (totalStock === 0) return { label: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-600' };
    if (totalStock < 10) return { label: 'Low Stock', color: 'bg-orange-500', textColor: 'text-orange-600' };
    if (totalStock < 20) return { label: 'Limited', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { label: 'In Stock', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  // Get available sizes
  const getAvailableSizes = (variants) => {
    const sizes = new Set();
    variants.forEach(variant => {
      variant.sizes.forEach(size => {
        if (size.stock > 0) {
          sizes.add(size.size);
        }
      });
    });
    return Array.from(sizes).join(', ');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    const totalStock = calculateTotalStock(product.variants);
    const matchesStock = 
      stockFilter === 'All' ||
      (stockFilter === 'In Stock' && totalStock > 0) ||
      (stockFilter === 'Low Stock' && totalStock > 0 && totalStock < 10) ||
      (stockFilter === 'Out of Stock' && totalStock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const MobileProductCard = ({ product }) => {
    const totalStock = calculateTotalStock(product.variants);
    const discount = calculateDiscount(product.price, product.mrp);
    const stockStatus = getStockStatus(product.variants);
    const availableSizes = getAvailableSizes(product.variants);

    return (
      <div className="bg-white rounded-xl p-3 border border-[#D4CDCA] mb-3">
        <div className="flex gap-3">
          <div className="w-16 h-20 bg-[#FFF7F3] rounded-lg overflow-hidden border border-[#D4CDCA] shrink-0">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <Shirt size={24} className="text-slate-300" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-serif font-bold text-[#1A1A1A] text-sm">{product.name}</h4>
                <p className="text-[10px] font-medium text-slate-500">{product.brand}</p>
              </div>
              {product.isFeatured && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[8px] font-bold rounded-full">
                  FEATURED
                </span>
              )}
            </div>
            <p className="text-[8px] font-mono text-slate-400 mt-0.5 uppercase">{product.id}</p>
            
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{product.category}</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{product.subCategory}</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{product.fabric}</span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-base font-serif font-black text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600">{discount}% off</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D4CDCA]/30">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${stockStatus.color}`} />
                <span className={`text-xs ${stockStatus.textColor}`}>{stockStatus.label}</span>
                <span className="text-xs text-slate-400">({totalStock} units)</span>
              </div>
              {availableSizes && (
                <div className="text-[10px] text-slate-500">
                  Sizes: {availableSizes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 mt-2">
              <button className="p-1.5 text-slate-400 hover:text-[#1A1A1A] hover:bg-slate-100 rounded-lg">
                <Edit size={14} />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];
  const stockFilters = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  return (
    <>
      <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex flex-1 items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#E0655F] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search by name, brand or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm bg-white border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none transition-all"
              />
            </div>
            
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden p-3 bg-white border border-[#D4CDCA] rounded-xl hover:bg-[#FFF7F3] transition-colors"
            >
              <Filter size={18} />
            </button>
            
            {/* Desktop Filter Dropdowns */}
            <div className="hidden sm:flex items-center gap-2">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-[#D4CDCA] rounded-xl text-sm focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-[#D4CDCA] rounded-xl text-sm focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
              >
                {stockFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Product Button */}
          <button 
            onClick={() => setShowAddProduct(true)}
            className="bg-[#1A1A1A] text-white px-4 sm:px-6 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#E0655F] transition-all active:scale-95 text-sm sm:text-base cursor-pointer"
          >
            <Plus size={18} strokeWidth={3} />
            <span className="whitespace-nowrap">Add Product</span>
          </button>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="sm:hidden bg-white rounded-xl p-4 border border-[#D4CDCA] animate-in slide-in-from-top-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    categoryFilter === cat 
                      ? 'bg-[#E0655F] text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Stock Status</h3>
            <div className="flex flex-wrap gap-2">
              {stockFilters.map((filter) => (
                <button 
                  key={filter} 
                  onClick={() => setStockFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    stockFilter === filter 
                      ? 'bg-[#E0655F] text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Table View - Keep your existing table code here */}
        {/* ... (your existing table code remains the same) ... */}

        {/* Mobile Card View */}
        <div className="sm:hidden">
          {filteredProducts.map((product) => (
            <MobileProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-[#D4CDCA]">
            <Shirt size={36} className="text-[#D4CDCA] mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">No products found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProduct 
          onClose={() => setShowAddProduct(false)}
          onSave={handleAddProduct}
        />
      )}
    </>
  );
};

export default ProductTable;