import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'

function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="bg-gray-800 h-screen">
      <div className="bg-black p-8 rounded-md flex items-center justify-center text-white text-8xl">Online Chess Games</div>
      <div className="flex">
        <div  className="w-full md:w-1/2 p-4 border-b">
          <img src="/chess_landing_page_image.jpg" alt="chess image loading..."/>
        </div>
        <div className="flex flex-col w-full md:w-1/2 p-4 border-b">
          <div className="text-6xl text-white p-5 ">Play Chess Online and level UP......</div>
          <Button onClick={()=>navigate('/game')}>Play Chess</Button>
        </div>
      </div>
      
    </div>
    
  )
}

export default LandingPage