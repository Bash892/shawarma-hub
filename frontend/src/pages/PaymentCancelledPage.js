import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelledPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-3 bg-white">
      <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300 mb-2">
        <span className="text-2xl">⚠️</span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">Payment Cancelled</h1>
      <p className="text-sm text-gray-600 max-w-md">
        Your payment was cancelled. You can review your cart and try again if
        you still want to place the order.
      </p>
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => navigate('/user/cart')}
          className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition"
        >
          Back to Cart
        </button>
        <button
          onClick={() => navigate('/user/menu')}
          className="rounded-full border border-gray-300 px-4 py-2 text-xs text-gray-700 hover:border-orange-500 hover:text-orange-600 transition"
        >
          Browse Menu
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelledPage;
