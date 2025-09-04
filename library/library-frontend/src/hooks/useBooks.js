import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

export const useBooks = () => {
  const genres = [
    'refactoring',
    'agile',
    'patterns',
    'design',
    'crime',
    'classic'
  ]

  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])

  useEffect(() => {
    getBooks({ variables: {} })
  }, [])

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  const handleFilter = genre => {
    getBooks({ variables: { genre } })
  }

  return {
    handleFilter,
    books,
    result,
    genres
  }
}
