// components/Container.js
export default function Container({ 
    children, 
    className="" 
}) {
  return (
    <div className= {`max-w-306 mx-auto text-gray-800 ${className}`}>
      {children}
    </div>
  )
}