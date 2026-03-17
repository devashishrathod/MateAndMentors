import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./store/store";

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

import MainLayout from "./components/Layout/MainLayout";
import MentorAdd from "./pages/mentor/MentorAdd";
import MenteeAdd from "./pages/mentee/MenteeAdd";
import Users from "./pages/Users";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const CategoryPage = lazy(() => import("./pages/category/categoryPage"));
const CategoryAddEdit = lazy(() => import("./pages/category/CategoryAddEdit"));
const MentorList = lazy(() => import("./pages/mentor/MentorList"));
const MenteeList = lazy(() => import("./pages/mentee/MenteeList"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              {/* Protected routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users" element={<Users />} />
                <Route path="/mentors" element={<MentorList />} />
                <Route path="/mentor/add" element={<MentorAdd />} />
                <Route path="/mentees" element={<MenteeList />} />
                <Route path="/mentee/add" element={<MenteeAdd />} />


                <Route path="/category/add" element={<CategoryAddEdit />} />
                <Route
                  path="/category/update/:id"
                  element={<CategoryAddEdit />}
                />
                {/* <Route path="/experts" element={<Experts />} />
                <Route path="/products" element={<Products />} />
                <Route path="/enquiries" element={<Enquiries />} />
                <Route
                  path="/prenatal-services"
                  element={<PrenatalServices />}
                />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/gallery" element={<Gallery />} /> */}
                {/* Default redirect to dashboard */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
