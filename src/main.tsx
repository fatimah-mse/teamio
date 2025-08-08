import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Route from './Route.tsx'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login.tsx'
import SignUp from './Pages/SignUp.tsx'
import ForgetPassword from './Pages/ForgetPassword.tsx'
import OTP from './Pages/OTP.tsx'
import ResetPassword from './Pages/ResetPassword.tsx'
import Dashboard from './Pages/Dashboard.tsx'
import Notes from './Pages/Notes.tsx'
import MyInfo from './Pages/MyInfo.tsx'
import ShowProject from './components/ShowProject.tsx'
import AddProject from './components/AddProject.tsx'
import EditProject from './components/EditProject.tsx'
import AddTask from './components/AddTask.tsx'
import Projects from './Pages/Projects.tsx'
import Tasks from './Pages/Tasks.tsx'
import ShowTask from './components/ShowTask.tsx'
import EditTask from './components/EditTask.tsx'
const routes = createHashRouter([
  {
    path: "/",
    element: <Route />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />
      },
      {
        path: "otp",
        element: <OTP />
      },
      {
        path: "reset-password",
        element: <ResetPassword />
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <Projects />
          },
          {
            path: "tasks",
            element: <Tasks />
          },
          {
            path: "notes",
            element: <Notes />
          },
          {
            path: "show-project/:id",
            element: <ShowProject />
          },
          {
            path: "edit-project/:id",
            element: <EditProject />
          },
          {
            path: "add-project",
            element: <AddProject />
          },
          {
            path: "add-task",
            element: <AddTask />
          },
          {
            path: "show-task/:id",
            element: <ShowTask />
          },
          {
            path: "edit-task/:id",
            element: <EditTask />
          },
          {
            path: "me",
            element: <MyInfo />
          }
        ]
      }
    ]
  },
],)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
)
