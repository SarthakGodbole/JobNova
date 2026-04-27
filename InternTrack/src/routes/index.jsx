import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { AdminRoute, StudentRoute } from '../components/RoleRoute';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentLayout from '../layouts/StudentLayout';
import Dashboard from '../pages/student/Dashboard';
import Applications from '../pages/student/Applications';
import ApplicationForm from '../pages/student/ApplicationForm';
import ApplicationDetails from '../pages/student/ApplicationDetails';
import Analytics from '../pages/student/Analytics';
import KanbanBoard from '../pages/student/KanbanBoard';

// Admin Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminApplications from '../pages/admin/Applications';

const Unauthorized = () => <h1>Unauthorized</h1>;
const NotFound = () => <h1>404 Not Found</h1>;


import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<StudentRoute />}>
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/student/analytics" element={<Analytics />} />
            <Route path="/student/kanban" element={<KanbanBoard />} />
            <Route path="/student/applications" element={<Applications />} />
            <Route path="/student/applications/new" element={<ApplicationForm />} />
            <Route path="/student/applications/:id" element={<ApplicationDetails />} />
            <Route path="/student/applications/:id/edit" element={<ApplicationForm />} />
            <Route path="/student/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Only Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
