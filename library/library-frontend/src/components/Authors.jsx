import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import { useEffect, useState } from 'react'
import AuthorForm from './AuthorForm'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) return <div>Loading...</div>

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AuthorForm />
    </div>
  )
}

export default Authors
