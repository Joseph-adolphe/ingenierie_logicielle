import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import CreatePrestataire from "./pages/CreatePrestataire";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import DashboardPage from "./pages/SpaceUser";
import ProviderDashboard from "./pages/DashboardPrestataire";
import DashboardAdmin from "./pages/DashboardAdmin";

// User Pages
import UserHome from "./pages/user/UserHome";
import UserExplorer from "./pages/user/UserExplorer";
import UserBookings from "./pages/user/UserBookings";
import UserMessages from "./pages/user/UserMessages";
import UserProfileView from "./pages/user/UserProfileView";
import UserProfileEdit from "./pages/user/UserProfileEdit";
import ProviderPublicProfile from "./pages/user/ProviderPublicProfile";

// Provider Pages
import ProviderHome from "./pages/provider/ProviderHome";
import ProviderPosts from "./pages/provider/ProviderPosts";
import ProviderRequests from "./pages/provider/ProviderRequests";
import ProviderMessages from "./pages/provider/ProviderMessages";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderProfileEdit from "./pages/provider/ProviderProfileEdit";

// Admin Pages
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminReported from "./pages/admin/AdminReported";
import AdminDomains from "./pages/admin/AdminDomains";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminProfileEdit from "./pages/admin/AdminProfileEdit";
import AdminUserDetailsPage from "./pages/admin/AdminUserDetailsPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/userProfile" element={<UserProfile />} />
      <Route path="/createPrestataire" element={<CreatePrestataire />} />

      {/* Protected Routes */}
      {/* User Dashboard - Accessible by Client, Provider, Admin */}
      <Route element={<ProtectedRoute allowedRoles={['client', 'prestataire', 'admin']} />}>
        <Route path="/user" element={<DashboardPage />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserHome />} />
          <Route path="explorer" element={<UserExplorer />} />
          <Route path="provider/:id" element={<ProviderPublicProfile />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="messages" element={<UserMessages />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="profile/edit" element={<UserProfileEdit />} />
        </Route>
        <Route path="/spaceUser/*" element={<Navigate to="/user" replace />} />
      </Route>

      {/* Provider Dashboard - Accessible by Provider, Admin */}
      <Route element={<ProtectedRoute allowedRoles={['prestataire', 'admin']} />}>
        <Route path="/provider" element={<ProviderDashboard />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProviderHome />} />
          <Route path="posts" element={<ProviderPosts />} />
          <Route path="requests" element={<ProviderRequests />} />
          <Route path="messages" element={<ProviderMessages />} />
          <Route path="profile" element={<ProviderProfile />} />
          <Route path="profile/edit" element={<ProviderProfileEdit />} />
        </Route>
        <Route path="/dashboardPrestataire/*" element={<Navigate to="/provider" replace />} />
      </Route>

      {/* Admin Dashboard - Accessible by Admin only */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardAdmin />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="user/:id" element={<AdminUserDetailsPage />} />
          <Route path="providers" element={<AdminProviders />} />
          <Route path="reported" element={<AdminReported />} />
          <Route path="domains" element={<AdminDomains />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="profile/edit" element={<AdminProfileEdit />} />
        </Route>
        <Route path="/dashboardAdmin/*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
