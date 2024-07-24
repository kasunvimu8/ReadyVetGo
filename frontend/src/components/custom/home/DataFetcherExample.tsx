import { useState, useEffect } from "react"
import { fetchUsers } from "@/api/user"
import { User } from "@/types/user"

function FetchSomeDataWithAxios() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        setUsers(users)
        setLoading(false)
      })
      .catch(() => {
        setError(
          "Failed to fetch users. Make sure that your backend is up and running"
        )
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="pt-10">Loading...</p>
  if (error) return <p className="pt-10">Error: {error}</p>

  return (
    <div className="pt-10">
      <h1>Sample Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <h2>{user.email}</h2>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FetchSomeDataWithAxios
