import { useState, useEffect } from 'react';
import { getCuratedProducts, getProducts, getProductCategories, trackAffiliateClick } from '../services/api';

const Shop = ({ petId, petName }) => {
  const [products, setProducts] = useState([]);
  const [curatedProducts, setCuratedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShopData();
  }, [petId, selectedCategory]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products based on selected category
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(filters),
        getProductCategories()
      ]);

      if (productsResponse.success) {
        setProducts(productsResponse.products || []);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.categories || []);
      }

      // Fetch curated products if we have a petId
      if (petId) {
        const curatedResponse = await getCuratedProducts(petId);
        if (curatedResponse.success) {
          setCuratedProducts(curatedResponse.products || []);
        }
      }
    } catch (err) {
      console.error('Error fetching shop data:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAffiliateClick = async (product) => {
    try {
      // Track the click
      await trackAffiliateClick(product.id, petId || 1, 'product');

      // Open affiliate link in new tab
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error tracking affiliate click:', err);
      // Still open the link even if tracking fails
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
    }
  };

  const ProductCard = ({ product, isRecommended = false }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Product Image Placeholder */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 h-48 flex items-center justify-center">
        <div className="text-6xl">
          {product.category === 'Toys' && '🎾'}
          {product.category === 'Beds' && '🛏️'}
          {product.category === 'Supplements' && '💊'}
          {product.category === 'Grooming' && '✂️'}
          {product.category === 'Health' && '🏥'}
          {!['Toys', 'Beds', 'Supplements', 'Grooming', 'Health'].includes(product.category) && '🐕'}
        </div>
      </div>

      <div className="p-4">
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              ⭐ Recommended for {petName || 'your pet'}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {product.category}
          </span>
        </div>

        {/* Star Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {'★'.repeat(5)}
          </div>
          <span className="ml-1 text-sm text-gray-600">(4.5+)</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <ul className="mb-3 space-y-1">
            {product.features.slice(0, 2).map((feature, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <svg className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            ${product.average_price?.toFixed(2) || '0.00'}
          </div>
          <button
            onClick={() => handleAffiliateClick(product)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center"
          >
            <span className="mr-1">🛒</span>
            Buy on Amazon
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Shop for {petName || 'Your Pet'}
        </h1>
        <p className="text-gray-600">
          Handpicked products to keep your pup happy and healthy
        </p>
      </div>

      {/* Personalized Recommendations Section */}
      {curatedProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="text-2xl mr-2">✨</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recommended for {petName || 'Your Pet'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} isRecommended={true} />
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* All Products Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory === 'all' ? 'All Products' : selectedCategory}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No products found in this category</p>
          </div>
        )}
      </div>

      {/* Trust & Info Section */}
      <div className="mt-12 bg-orange-50 rounded-xl p-8 border border-orange-200">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🎁</div>
            <h4 className="font-semibold text-gray-900 mb-1">Curated Selection</h4>
            <p className="text-sm text-gray-600">
              Every product is carefully chosen for quality and safety
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🚚</div>
            <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
            <p className="text-sm text-gray-600">
              Shipped directly from Amazon with Prime eligible options
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-900 mb-1">Best Prices</h4>
            <p className="text-sm text-gray-600">
              Competitive pricing and frequent deals on Amazon
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          As an Amazon Associate, PupSense earns from qualifying purchases.
          Prices and availability subject to change.
        </p>
      </div>
    </div>
  );
};

export default Shop;
