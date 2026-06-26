import ChatSidebar from "../component/ChatSidebar"
import { useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../utils/axios"

const ChatPage = () => {
    const queryClient = useQueryClient()
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['getMessages'],
        queryFn: async () => {
            try {
                const res = await api.get(`/chat/message/6a17dea6f116ac69a2ccb12e`)
                console.log(res)
                return res.data
            } catch (error) {
                console.log(error)
                throw new Error('Message not found')
            }

        }
    })
    console.log(data)
    return (
        <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
            <div className="flex ">
                <ChatSidebar />
                <div>Messages</div>

            </div>
        </div>
    )
}

export default ChatPage