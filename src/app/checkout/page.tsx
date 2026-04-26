"use client";

import React, { useState } from "react";
import { useCart } from "@/frontend/context/CartContext";
import { useAuth } from "@/frontend/context/AuthContext";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Checkout Placeholder
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
           Checkout page logic goes here. Total items: {totalItems}, Total price: {totalPrice}
        </div>
      </div>
    </div>
  );
}
