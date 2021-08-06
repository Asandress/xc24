import React, { useEffect, useState } from 'react'

export const Index = () => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    //console.log('index load')
    setLoading(true)

  }, [])

  return (

    <main>
      <button onClick={() => console.log('send')}>SEND</button>
    </main>

  )
}