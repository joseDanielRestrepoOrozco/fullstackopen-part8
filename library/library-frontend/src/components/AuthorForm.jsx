import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_BORN } from '../queries'
import Select from 'react-select'

const AuthorForm = () => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState(0)
  const results = useQuery(ALL_AUTHORS)
  const [changeBorn] = useMutation(EDIT_BORN)

  const handleSubmit = event => {
    event.preventDefault()
    console.log(name)

    changeBorn({ variables: { name: name.value, setBornTo: born } })

    setName('')
    setBorn(0)
  }

  if (results.loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Set birthyear</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <Select
            defaultValue={name}
            onChange={setName}
            options={results.data.allAuthors.map(a => ({
              value: a.name,
              label: a.name
            }))}
          />
        </div>
        <div>
          <label>
            Born
            <input
              type="number"
              value={born}
              onChange={e => setBorn(Number(e.target.value))}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm
