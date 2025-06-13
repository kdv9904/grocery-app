import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Cart = () => {
    const {
        products, currency, cartItems, removeFromCart, getCartCount,
        updateCartItem, navigate, getCartAmount, axios, user, setCartItems
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState('COD');
    const addressDropdownRef = useRef();

    useEffect(() => {
        if (products.length > 0 && Object.keys(cartItems).length > 0) {
            let tempArray = [];
            for (const key in cartItems) {
                const product = products.find(item => item._id === key);
                product.quantity = cartItems[key];
                tempArray.push(product);
            }
            setCartArray(tempArray);
        }
    }, [products, cartItems]);

    useEffect(() => {
        const getUserAddress = async () => {
            try {
                const { data } = await axios.get('api/address/get');
                if (data.success) {
                    setAddresses(data.addresses);
                    if (data.addresses.length > 0) {
                        setSelectedAddress(data.addresses[0]);
                    }
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (user) getUserAddress();
    }, [user]);

    // Hide dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addressDropdownRef.current && !addressDropdownRef.current.contains(event.target)) {
                setShowAddress(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const placeOrder = async () => {
        try {
            if (!selectedAddress) return toast.error("Please select an address");

            const orderItems = cartArray.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));

            if (paymentOption === 'COD') {
                const { data } = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: orderItems,
                    address: selectedAddress._id
                });
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            } else {
                
                const { data } = await axios.post('/api/instamojo/pay', {
  amount: 100,
  buyer_name: 'John Doe',
  email: 'john@example.com',
  phone: '9999999999'
})
                if (data.success) {
                    window.location.href = data.link;
                } else {
                    toast.error("Failed to generate payment link.");
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-indigo-500">{getCartCount()} Items</span>
                </h1>
                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium pt-3 text-gray-500">
                        <div className="flex items-center gap-3 md:gap-6">
                            <div
                                onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                    scrollTo(0, 0);
                                }}
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                            >
                                <img className="max-w-full h-full object-cover" src={product.images[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <p className="font-normal text-gray-500/70">Weight: <span>{product.weight || "N/A"}</span></p>
                                <div className="flex items-center">
                                    <p>Qty:</p>
                                    <select
                                        onChange={e => updateCartItem(product._id, Number(e.target.value))}
                                        value={cartItems[product._id]}
                                        className="outline-none"
                                    >
                                        {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{(product.price - product.offerPrice) * product.quantity}</p>
                        <button onClick={() => removeFromCart(product._id)} className="mx-auto cursor-pointer">
                            <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                        </button>
                    </div>
                ))}

                <button onClick={() => navigate('/')} className="group mt-8 flex items-center gap-2 text-indigo-500 font-medium">
                    <img src={assets.arrow_right_icon_colored} alt="arrow" className="group-hover:-translate-x-1 transition" />
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 mt-10 md:mt-0 border border-gray-300/70">
                <h2 className="text-xl font-medium">Order Summary</h2>
                <hr className="my-5 border-gray-300" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative mt-2" ref={addressDropdownRef}>
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : 'No address found'}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="absolute top-0 right-0 text-indigo-500 hover:underline text-sm">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute z-10 top-10 left-0 w-full bg-white border border-gray-300 text-sm shadow-md">
                                {addresses.map((address, idx) => (
                                    <p key={idx} onClick={() => { setSelectedAddress(address); setShowAddress(false); }} className="p-2 hover:bg-gray-100 cursor-pointer">
                                        {address.street}, {address.city}, {address.state}
                                    </p>
                                ))}
                                <p onClick={() => { navigate('/add-address'); setShowAddress(false); }} className="text-indigo-500 text-center p-2 cursor-pointer hover:bg-indigo-100">
                                    + Add New Address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 px-3 py-2 mt-2 outline-none bg-white">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between"><span>Price</span><span>{currency}{getCartAmount()}</span></p>
                    <p className="flex justify-between"><span>Shipping Fee</span><span className="text-green-600">Free</span></p>
                    <p className="flex justify-between"><span>Tax (2%)</span><span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span></p>
                    <p className="flex justify-between text-lg font-medium mt-3"><span>Total:</span><span>{currency}{(getCartAmount() * 1.02).toFixed(2)}</span></p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : null;
};

export default Cart;
