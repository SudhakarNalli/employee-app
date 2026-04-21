'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [employees, setEmployees] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getEmployees()
  }, [])

  async function getEmployees() {
    const { data } = await supabase.from('employees').select('*')
    if (data) setEmployees(data)
  }

  async function addEmployee() {
    if (!name || !email) return alert("Enter all fields")

    if (editId) {
      await supabase
        .from('employees')
        .update({ name, email })
        .eq('id', editId)

      setEditId(null)
    } else {
      await supabase
        .from('employees')
        .insert([{ name, email }])
    }

    setName('')
    setEmail('')
    getEmployees()
  }

  async function deleteEmployee(id) {
    await supabase.from('employees').delete().eq('id', id)
    getEmployees()
  }

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center p-6">
      <div className="w-full max-w-3xl">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Employee Manager
        </h1>

        {/* CARD - FORM */}
        <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg mb-6 border">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Employee" : "Add Employee"}
          </h2>

          <input
            className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={addEmployee}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {editId ? "Update" : "Add Employee"}
          </button>
        </div>

        {/* SEARCH */}
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* EMPLOYEE LIST */}
        <div className="space-y-3">
          {filtered.map(emp => (
            <div
              key={emp.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition flex justify-between items-center border"
            >
              <div>
                <p className="font-semibold text-gray-800">{emp.name}</p>
<p className="text-sm text-gray-500">{emp.email}</p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => {
                    setName(emp.name)
                    setEmail(emp.email)
                    setEditId(emp.id)
                  }}
                  className="bg-yellow-400 px-3 py-1.5 rounded-lg hover:bg-yellow-500 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
  <p className="text-center text-gray-500 mt-4">
    No employees found
  </p>
)}

      </div>
    </div>
  )
}