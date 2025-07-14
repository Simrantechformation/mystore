import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AllProducts from '@/components/pages/AllProducts'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
    <AllProducts/>
    </ProtectedRoute>
  )
}

export default page