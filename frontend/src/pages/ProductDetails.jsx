import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const product = products.find((item) => item._id === id);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
  if (product?.images && product.images.length > 0) {
    setThumbnail(product.images[0]);
  } else {
    setThumbnail(assets.fallback_image || null);
  }
}, [product]);


  useEffect(() => {
    if (product && products.length > 0) {
      const filtered = products.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(filtered);
    }
  }, [product, products]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="mt-10 px-4">
      <p className="text-gray-600">
        <Link to="/">Home</Link> / 
        <Link to="/products"> Products</Link> / 
        <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> / 
        <span className="text-primary"> {product.name}</span>
      </p>

      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        {/* Left Image section */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product?.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                className="w-20 h-20 object-cover rounded border cursor-pointer hover:border-primary"
                onClick={() => setThumbnail(img)}
                onError={(e) => (e.target.src = assets.fallback_image)}
              />
            ))}
          </div>

          <div className="border rounded w-[300px] h-[300px] flex items-center justify-center bg-white shadow-sm">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Main Display"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <p className="text-gray-400">No image available</p>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>

          <div className="flex items-center gap-1 mb-2">
            {Array(5)
              .fill('')
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-4"
                />
              ))}
            <span className="ml-2 text-gray-600">(4)</span>
          </div>

          <div className="my-4">
            <p className="text-gray-400 line-through text-sm">
              MRP: {currency}{product.price}
            </p>
            <p className="text-2xl font-bold text-green-600">
              MRP: {currency}{product.price - product.offerPrice}
            </p>
            <p className="text-sm text-gray-500">(inclusive of all taxes)</p>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-base mb-2">About Product</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {product?.description?.map((desc, idx) => (
                <li key={idx}>{desc}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              onClick={() => addToCart(product._id)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded"
            >
              Add to Cart
            </button>
            <button onClick={() => {
  addToCart(product._id);
  setTimeout(() => navigate('/cart'), 100); // wait 100ms before navigation
}}  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-1">Related Products</h2>
        <div className="w-16 h-1 mx-auto bg-primary rounded mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {relatedProducts
            .filter((item) => item.inStock)
            .map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
        </div>
        <button
          onClick={() => {
            navigate('/products');
            scrollTo(0, 0);
          }}
          className="mt-10 px-8 py-2 border border-primary text-primary rounded hover:bg-primary/10"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
