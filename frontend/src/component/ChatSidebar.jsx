import { CiSearch } from "react-icons/ci";
const ChatSidebar = () => {
  return (
    <div className="flex flex-col p-3">
        <input className="p-2 rounded-lg outline-gray-700 bg-gray-700" placeholder="Search"/> 
        <div className="mt-5 h-screen rounded-lg border border-gray-600 p-1">
            <h1 className="font-bold text-lg text-center">Messages</h1>

        </div>
    </div>
  )
}

export default ChatSidebar