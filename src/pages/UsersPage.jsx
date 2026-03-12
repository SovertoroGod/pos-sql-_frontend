import React from 'react';
import AdminLayout from '../components/AdminLayout';
import UserManagementPage from '../modules/users/UserManagementPage';

const UsersPage = () => {
  return (
    <AdminLayout>
      <UserManagementPage />
    </AdminLayout>
  );
};

export default UsersPage;
