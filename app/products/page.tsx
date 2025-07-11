import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ProductPage from '@/components/product/ProductPage'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
    <ProductPage/>
    </ProtectedRoute>
  )
}

export default page