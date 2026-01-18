interface AppProps {
  title: string
  blurb?: string
}

function App({title, blurb}: AppProps) {
  
  return (
    <>
      <h2>{title}</h2>
      {blurb && <p>{blurb}</p>}
    </>
  )
}

export default App