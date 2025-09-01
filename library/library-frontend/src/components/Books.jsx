import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useMemo, useState } from 'react'

const Books = () => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState(null)

  if (result.loading) return <div>Loading...</div>

  const books = result.data.allBooks

  const genres = Array.from(new Set(books.flatMap(b => b.genres)))

  const booksToShow = filter
    ? books.filter(b => b.genres.includes(filter))
    : books

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => setFilter(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setFilter(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
