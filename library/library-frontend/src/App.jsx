import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Route, Routes, useNavigate } from 'react-router'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { useApolloClient, useSubscription } from '@apollo/client'
import Recommend from './components/Recommend'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = a => {
    let seen = new Set()
    return a.filter(item => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/')
  }

  return (
    <div>
      <div>
        <button onClick={() => navigate('/')}>authors</button>
        <button onClick={() => navigate('/books')}>books</button>
        {token ? (
          <>
            <button onClick={() => navigate('/add')}>add book</button>
            <button onClick={logout}>logout</button>
            <button onClick={() => navigate('/recommend')}>Recommend</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>login</button>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook setError={notify} />} />
        <Route
          path="/login"
          element={<LoginForm setToken={setToken} setError={notify} />}
        />
        <Route path="/recommend" element={<Recommend />} />
      </Routes>
    </div>
  )
}

export default App
