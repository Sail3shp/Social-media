import { useQuery } from "@tanstack/react-query";
import { CiSearch } from "react-icons/ci";
import { api } from "../utils/axios";
import { Link } from "react-router";
const ChatSidebar = () => {
    const { isError, data: users, isPending } = useQuery({
        queryKey: ['sidebarUsers'],
        queryFn: async () => {
            try {
                const res = await api.get('/chat/sidebarusers')
                console.log(res.data)
                return res.data
            } catch (error) {
                console.log(error)
            }
        }
    })
    console.log(users?.data, isPending)
    return (
        <div className="flex flex-col p-3">
            <input className="p-2 rounded-lg outline-gray-700 bg-gray-700" placeholder="Search" />
            <div className="mt-5 h-full rounded-lg border border-gray-600 p-1">
                <h1 className="font-bold text-lg text-center">Messages</h1>

                <div className="mt-5 flex gap-5 p-2 ">
                    {users?.data.map((user) => (
                        <Link to={`/chat/${user._id}`} key={user._id} className="flex gap-4 ">
                            <img className="size-10 rounded-full" src={user.avatar || '/avatar-placeholder.png'} />
                            <h1 className="text-sm tracking-wide font-light">@{user.username}</h1>

                        </Link>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default ChatSidebar