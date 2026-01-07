import { Header } from '../core/Header'
import { useAuth } from './auth-provider' 
import { Navigate, Outlet, useLocation } from 'react-router' 
export default function ProtectedLayout() { 
const { isAuthenticated } = useAuth() 
let location = useLocation() 
if (!isAuthenticated) { 
return <Navigate to='/login' replace state={{ from: location }} 
/> 
} 
 return ( 
    <> 
      <Header /> 
      <main className='container mx-auto flex flex-col gap-4 pt-16 
px-4'> 
        <Outlet /> 
      </main> 
    </> 
  ) 
} 