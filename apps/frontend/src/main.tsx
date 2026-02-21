import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Root } from './Root'
import SessionProvider from './providers/session-provider'
import { LoginPage } from './pages/login-page'
import { SignupPage } from './pages/signup-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SessionProvider>
        <Root />
      </SessionProvider>
    ),
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
