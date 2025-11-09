import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Root from './layouts/Root.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'
import Register from './pages/Register/Register.jsx'
import AllReviews from './pages/AllReviews/AllReviews.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import AddReview from './pages/AddReview/AddReview.jsx'
import { Toaster } from 'react-hot-toast'
import MyReviews from './pages/MyReviews/MyReviews.jsx'
import EditReview from './pages/EditReview/EditReview.jsx'
import ErrorPage from './ErrorElement/ErrorPage.jsx'
import ReviewDetails from './pages/ReviewDetails/ReviewDetails.jsx'
import MyFavorites from './pages/MyFavorites/MyFavorites.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "all-reviews",
        element: <AllReviews></AllReviews>
      },
      {
        path: "add-review",
        element: <PrivateRoute><AddReview></AddReview></PrivateRoute>
      },
      {
        path: "my-reviews",
        element: <PrivateRoute><MyReviews></MyReviews></PrivateRoute>
      },
      {
        path: "/edit-review/:id",
        element: <PrivateRoute><EditReview></EditReview></PrivateRoute>
      },
      {
        path: "/review/:id",
        element: <PrivateRoute><ReviewDetails></ReviewDetails></PrivateRoute>
      },
      {
        path: "my-favorites",
        element: <PrivateRoute><MyFavorites></MyFavorites></PrivateRoute>
      },
      {
        path: "*",
        element: <ErrorPage></ErrorPage>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>,
)
