// AddProduct.jsx
import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, ChevronLeft, ChevronRight, Save, Image as ImageIcon } from 'lucide-react';

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {[1, 2, 3, 4].map((step) => (
      <div key={step} className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${currentStep === step ? 'bg-[#E0655F] text-white' : 
            currentStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
          {currentStep > step ? '✓' : step}
        </div>
        {step < 4 && (
          <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        )}
      </div>
    ))}
  </div>
);

const AddProduct = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    brand: '',
    category: 'Men',
    subCategory: '',
    description: '',
    
    // Pricing
    price: '',
    mrp: '',
    
    // Product Details
    fabric: '',
    fit: 'Regular Fit',
    isFeatured: false,
    
    // Images
    images: [],
    
    // Variants
    variants: [
      {
        color: '',
        sizes: [
          { size: 'S', stock: 0 },
          { size: 'M', stock: 0 },
          { size: 'L', stock: 0 },
          { size: 'XL', stock: 0 }
        ]
      }
    ],
    
    // Tags
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Categories and SubCategories mapping
  const categoryOptions = ['Men', 'Women', 'Kids', 'Accessories'];
  
  const subCategoryOptions = {
    Men: ['Kurtas', 'Sherwanis', 'Nehru Jackets', 'Pathani Suits', 'Waistcoats', 'Dhotis', 'Accessories'],
    Women: ['Sarees', 'Salwar Suits', 'Lehengas', 'Anarkali', 'Kurtis', 'Gowns', 'Dupattas', 'Accessories'],
    Kids: ['Boys Ethnic', 'Girls Ethnic', 'Accessories'],
    Accessories: ['Jewelry', 'Footwear', 'Bags', 'Watches', 'Others']
  };

  const fitOptions = ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Oversized Fit', 'One Size'];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle variant color change
  const handleVariantColorChange = (index, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index].color = value;
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  // Handle size stock change
  const handleSizeStockChange = (variantIndex, sizeIndex, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].sizes[sizeIndex].stock = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  // Add new variant
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: '',
          sizes: [
            { size: 'S', stock: 0 },
            { size: 'M', stock: 0 },
            { size: 'L', stock: 0 },
            { size: 'XL', stock: 0 }
          ]
        }
      ]
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // Update form data with image paths (you'd normally upload to server and get URLs)
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(f => URL.createObjectURL(f))]
    }));
  };

  // Remove image
  const removeImage = (index) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle tags
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Form validation
  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.name && formData.brand && formData.category && formData.subCategory;
      case 2:
        return formData.price && formData.mrp && formData.fabric && formData.fit;
      case 3:
        return formData.variants.every(v => v.color && v.sizes.some(s => s.stock > 0));
      default:
        return true;
    }
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Submit form
  const handleSubmit = () => {
    // Calculate total stock for validation
    const totalStock = formData.variants.reduce((total, variant) => {
      return total + variant.sizes.reduce((sum, size) => sum + size.stock, 0);
    }, 0);

    if (totalStock === 0) {
      alert('Please add at least one item in stock');
      return;
    }

    // Prepare final product data
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      mrp: parseFloat(formData.mrp),
      // In real app, you'd upload images and get URLs
      images: imagePreviews // This would be actual URLs from server
    };

    onSave(productData);
    onClose();
  };

  // Render step indicators (defined outside component)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#D4CDCA] p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Add New Product</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-6">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                    placeholder="e.g., Black Chevron Designer Kurta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                    placeholder="e.g., Riwayat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sub Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                  >
                    <option value="">Select Sub Category</option>
                    {subCategoryOptions[formData.category]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                    placeholder="Product description..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Pricing & Product Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                    placeholder="e.g., 2899"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    MRP (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                    placeholder="e.g., 5999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fabric <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                    placeholder="e.g., Jacquard Silk Blend"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="fit"
                    value={formData.fit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                  >
                    {fitOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#E0655F] rounded border-[#D4CDCA] focus:ring-[#E0655F]"
                    />
                    <span className="text-sm text-slate-700">Mark as Featured Product</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Variants & Stock */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Variants & Stock</h3>
              
              {formData.variants.map((variant, variantIndex) => (
                <div key={variantIndex} className="border border-[#D4CDCA] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Variant {variantIndex + 1}</h4>
                    {formData.variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(variantIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantColorChange(variantIndex, e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                      placeholder="e.g., Black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stock by Size
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {variant.sizes.map((size, sizeIndex) => (
                        <div key={size.size}>
                          <label className="block text-xs text-slate-500 mb-1">{size.size}</label>
                          <input
                            type="number"
                            min="0"
                            value={size.stock}
                            onChange={(e) => handleSizeStockChange(variantIndex, sizeIndex, e.target.value)}
                            className="w-full px-3 py-2 border border-[#D4CDCA] rounded-lg focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addVariant}
                className="flex items-center gap-2 text-[#E0655F] hover:text-[#d44a44] font-medium"
              >
                <Plus size={16} />
                Add Another Color Variant
              </button>
            </div>
          )}

          {/* Step 4: Images & Tags */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Images & Tags</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-[#D4CDCA] rounded-xl p-6">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="mt-4 flex text-sm text-slate-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-[#E0655F] hover:text-[#d44a44]">
                        <span>Upload images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-[#D4CDCA]"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-[#D4CDCA] rounded-xl focus:ring-2 focus:ring-[#E0655F]/20 focus:border-[#E0655F] outline-none"
                    placeholder="Add tags and press Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#E0655F] transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#D4CDCA]">
            <button
              onClick={currentStep === 1 ? onClose : prevStep}
              className="px-6 py-3 border border-[#D4CDCA] rounded-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className={`px-8 py-3 rounded-xl flex items-center gap-2 font-bold
                  ${validateStep(currentStep)
                    ? 'bg-[#1A1A1A] text-white hover:bg-[#E0655F] cursor-pointer'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 font-bold"
              >
                <Save size={16} />
                Save Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;