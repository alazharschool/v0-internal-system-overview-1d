"use client"

import { useState } from "react"
import { signInAdmin } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { success, error: err } = await signInAdmin(email, password)
    if (!success) {
      setError(err || "Login failed")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className={cn("w-full p-2 mb-2 border rounded")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className={cn("w-full p-2 mb-2 border rounded")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full p-2 rounded text-white",
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}
