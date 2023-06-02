import { useState } from "react"

export function App() {
  const [name, setName] = useState('world')
  return (
    <div>
      <h1>hello {name}</h1>
      <input type="text" onChange={ev => setName(ev.target.value)} value={name} />
    </div>
  )
}
