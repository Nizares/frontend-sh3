// components/Container.js
export default function Container({ 
    children, 
    className="" 
}) {
  return (
    <div className="max-w-306 mx-auto px-4 text-gray-800">
      {children}
    </div>
  )
}