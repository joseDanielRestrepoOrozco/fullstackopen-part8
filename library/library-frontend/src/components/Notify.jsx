const Notify = ({ errorMessage }) => {
  if (!errorMessage) return null

  return <span style={{ color: 'red' }}>{errorMessage}</span>
}

export default Notify
