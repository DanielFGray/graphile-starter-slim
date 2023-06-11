import { useState } from "react"
import { useSharedQuery } from "../generated"

export function App() {
  const [name, setName] = useState('world')
  const { data, loading, error, refetch } = useSharedQuery();
  return (
    <div>
      <h1>hello {name}</h1>
      <form>
        <input type="text" onChange={ev => setName(ev.target.value)} value={name} />
      </form>
      <pre>{JSON.stringify({ data, loading, error }, null, 2)}</pre>
      <button onClick={() => refetch()}>refetch</button>
    </div>
  )
}
