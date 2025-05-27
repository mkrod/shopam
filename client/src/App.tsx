import React from 'react'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router';
import RootLayout from '@/layouts/rootLayout';
import TabsLayout from '@/layouts/tabsLayout';
import HomePage from '@/pages/home';
import Explore from '@/pages/explore';
import Saved from '@/pages/saved';
import Me from '@/pages/me';
import Cart from '@/pages/cart';
import Checkout from '@/pages/checkout';
import { GlobalProvider } from './constants/provider';
import ProductPage from './pages/product';
import Category from './pages/category';
import Search from './pages/search';
import NotFound from './components/404';
import AuthLayout from './layouts/authLayout';
import SignUp from './pages/signup';
import SignIn from './pages/signin';
import Orders from './pages/orders';
import OrderDetails from './pages/order_details';

const App : React.FC = () : React.JSX.Element => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='/' element={<TabsLayout />}>
          <Route index element={<HomePage />}/>
          <Route path='explore' element={<Explore />}/>
          <Route path='saved' element={<Saved />}/>
          <Route path='profile' element={<Me />}/>
          <Route path='product/:id/*' element={<ProductPage />} /> 
          <Route path='category/:name/:id/*' element={<Category  />} />
          <Route path='cart' element={<Cart />} />
          <Route path='checkout' element={<Checkout />} />
          <Route path='search/:query/:type/*' element={<Search />}/>
          <Route path='orders' element={<Orders />} />
          <Route path='orders/details/:order_id' element={<OrderDetails />} />
          
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='' element={<AuthLayout />}>
          <Route path='auth/signup' element={<SignUp/>} />
          <Route path='auth/signin' element={<SignIn />} />
        </Route>


        
      </Route>
    )
  )

  return (
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  )
}

export default App;