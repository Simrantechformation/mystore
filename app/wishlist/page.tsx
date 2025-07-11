import ProtectedRoute from '@/components/auth/ProtectedRoute'
import WishlistPage from '@/components/product/WishListPage'
import React from 'react'

const page = () => {
  return (
    <div>
        <ProtectedRoute>
          <WishlistPage/>
        </ProtectedRoute>
    </div>
  )
}

export default page