import React from 'react'

export const Button = ({onClick, children}) => {
  return (
    <button onClick={onClick} className="bg-black p-4 w-1/2 text-4xl rounded-md text-white hover:bg-gray-900">
        {children}
    </button>
  )
}
