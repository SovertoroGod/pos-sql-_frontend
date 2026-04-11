import React from 'react'
import useCreateUser from "../../hooks/useCreateUser";
import AdminLayout from "../../components/AdminLayout"
const CreateUserPage = () => {

    const { form, branches, handleChange, handleSubmit, isLoading, navigate } = useCreateUser();
  return (
          <div className="p-6 max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Create User</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="full_name" placeholder='Full Name' value={form.full_name} onChange={handleChange} className='w-full border p-2 rounded' required />
                  <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full border p-2 rounded" required/>
                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
                  <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className='w-full border p-2 rounded' required />
                  <select className='w-full border p-2 rounded' value={form.role} onChange={handleChange} required>
                      <option value="">Select Role</option>
                      <option value='admin'>Admin</option>
                      <option value='manager'>Manager</option>
                      <option value="cashier">Cashier</option>
                  </select>
                  <select className='w-full border p-2 rounded' value={form.branch_id} onChange={handleChange} required>
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                              {branch.name} - {branch.code}
                          </option>
                      ))}
                  </select>
                  <div className="flex gap-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isLoading} type='submit'>
                          {isLoading ? "Creating..." : "Create User"}
                      </button>
                      <button type="button" onClick={() => navigate("/admin/users")} className='bg-gray-400 text-white px-4 py-2 rounded'>Cancel</button>
                  </div>
              </form>
          </div>
  )
}

export default CreateUserPage