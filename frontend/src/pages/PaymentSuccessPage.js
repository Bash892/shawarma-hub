import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('tasty_cart');
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-3">
      <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/60 mb-2">
        <span className="text-2xl">✅</span>
      </div>
      <h1 className="text-2xl font-semibold">Payment Successful</h1>
      <p className="text-sm text-slate-300 max-w-md">
        Thank you for your order! Your payment has been processed and your order
        is being prepared.
      </p>
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => navigate('/user/orders')}
          className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition"
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate('/user/menu')}
          className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:border-red-500 hover:text-red-300 transition"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
