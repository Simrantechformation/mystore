"use client"
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CartPage from '@/components/product/CartPage'
import React from 'react'

const page = () => {
  return (
    <div>
        <ProtectedRoute>
          <CartPage/>
        </ProtectedRoute>


   </div>
  )
}

export default page