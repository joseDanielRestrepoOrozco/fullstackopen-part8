import { useBooks } from '../hooks/useBooks'

const GenreButton = ({ name, setFilter }) => {
  return <button onClick={setFilter}>{name}</button>
}

const Books = () => {
  const {result, books, genres, handleFilter} = useBooks()

  if (result.loading) return <div>Loading...</div>

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
          {books.map(a => (
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
          <GenreButton key={g} name={g} setFilter={() => handleFilter(g)} />
        ))}
        <GenreButton
          name={'all genres'}
          setFilter={() => handleFilter(undefined)}
        />
      </div>
    </div>
  )
}

export default Books
