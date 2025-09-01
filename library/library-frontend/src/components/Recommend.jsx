import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = () => {
  const me = useQuery(ME)
  const books = useQuery(ALL_BOOKS)

  if (me.loading || books.loading) {
    return <div>Loading...</div>
  }

  console.log(books.data.allBooks)
  console.log(me)

  const favoriteBooks = books.data.allBooks.filter(b =>
    b.genres.includes(me.data.me.favoriteGenre)
  )

  console.log(favoriteBooks)

  return (
    <>
      <h2>recommendations</h2>
      <table>
        <caption>
          books in your favorite genre <strong>patterns</strong>
        </caption>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {favoriteBooks.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Recommend
