import React from 'react'
import Header from './components/Header'
import Gallery from './components/Gallery'
// import Videos from './components/Videos'  // uncomment once you create Videos.jsx

function App() {
  return (
    <>
      <Header />

      <main>
        <Gallery />
        {/* 
          When you’re ready, create a Videos.jsx component under src/components/
          and then uncomment the import above and render it here:
          <Videos />
        */}
      </main>
    </>
  )
}

export default App