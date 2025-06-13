import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user, getCartAmount } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [user]);

  return (
    <div className='mt-16 pb-16'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        myOrders.map((order, index) => {
          // Calculate total for all items
          const calculatedAmount = order.items.reduce((acc, item) => {
            const price = item.product?.price ?? 0;
            return acc + price * (item.quantity || 1);
          }, 0);

          const tax = Math.floor(calculatedAmount * 0.02);
          const finalAmount = order.items.reduce((total, item) => {
  const price = item.product?.price ?? 0;
  const qty = item.quantity || 1;
  return total + price * qty * 1.02; // apply tax per item
}, 0).toFixed(2);


          return (
            <div
              key={index}
              className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'
            >
              <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                <span>OrderId: {order._id}</span>
                <span>Payment: {order.paymentType}</span>
                <span>Total Amount: {currency}{finalAmount}</span>
              </p>

              {order.items.map((item, i) => {
                const itemPrice = item.product?.price ?? 0;
                const itemImage = item.product?.images?.[0] || '';

                return (
                  <div
                    key={i}
                    className={`relative bg-white text-gray-500/70 ${order.items.length !== i + 1 ? 'border-b' : ''} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                  >
                    <div className='flex items-center mb-4 md:mb-0'>
                      <div className='bg-primary/10 p-4 rounded-lg'>
                        <img
                          src={itemImage}
                          alt={item.product?.name}
                          className='w-16 h-16 object-cover'
                        />
                      </div>
                      <div className='ml-4'>
                        <h2 className='text-xl font-medium text-gray-800'>
                          {item.product?.name}
                        </h2>
                        <p>Category: {item.product?.category}</p>
                      </div>
                    </div>

                    <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                      <p>Quantity: {item.quantity || "1"}</p>
                      <p>Status: {order.status}</p>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className='text-right'>
                      <p className='text-gray-600 text-sm'>
                        Amount: {currency}{(itemPrice * (item.quantity || 1) * 1.02).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
