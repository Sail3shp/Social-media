import ChatSidebar from "../component/ChatSidebar"
import { useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../utils/axios"
import Messages from "../component/Messages"
import { Outlet } from "react-router"

const ChatPage = () => {
    /*const queryClient = useQueryClient()
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['getMessages'],
        queryFn: async () => {
            try {
                const res = await api.get(`/chat/sidebarusers`)
                console.log(res)
                return res.data
            } catch (error) {
                console.log(error)
                throw new Error('user not found')
            }

        }
    })
        */
    return (
        <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
            <div className="flex h-full ">
                <ChatSidebar />
                <Outlet />

            </div>
        </div>
    )
}

export default ChatPage