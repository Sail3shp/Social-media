import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"
import { api } from "../utils/axios"
import { useState } from "react"
import toast from "react-hot-toast"

const Messages = () => {

    const { id } = useParams()
    const [text,setText] = useState('')

    const { isPending, isError, data: messages, error } = useQuery({
        queryKey: ['messages', id],
        queryFn: async () => {
            try {
                const res = await api.get(`/chat/message/${id}`)
                return res.data
            } catch (error) {
                console.log(error)
            }
        }
    })


    const mutation = useMutation({
        mutationFn: async() => {
            const res = await api.post(`/chat/message/${id}`,{text})
            console.log(res,res.data)
        },
        onSuccess: async() =>{
            toast.success('Message sent')
        }
    })

    const queryClient = useQueryClient()

    const { user: authUser } = queryClient.getQueryData(['user'])
    const chatUser = messages?.data[0]?.sender._id === authUser._id ? messages?.data[0].receiver : messages?.data[0].sender;

    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate()
        setText(null)


    }

    if (!id) {
        return <h1>Message someone</h1>
    }

    return (
        <div className="h-full w-full flex flex-col  p-2 ">
            <div className="flex sticky gap-5 p-2 w-full">
                <img src="/avatar-placeholder.png" className="size-10 rounded-full" />
                <div>
                    <h1 className="font-bold tracking-wide text-xl">{chatUser?.username} </h1>
                    <p className="text-sm ">*Online</p>
                </div>
            </div>
            <div className="flex-1 space-y-3">
                {messages?.data.map((message) => {
                    const isSender = authUser._id === message.sender._id
                    return (
                        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-center gap-2`} key={message._id}>
                            <div
                                className={`flex items-end gap-2 max-w-[70%] ${isSender ? "flex-row-reverse" : ""
                                    }`}
                            >
                                <img
                                    src={
                                        isSender
                                            ? authUser.avatar || "/avatar-placeholder.png"
                                            : message.sender.avatar || "/avatar-placeholder.png"
                                    }
                                    className="size-8 rounded-full"
                                />

                                <div
                                    className={`rounded-2xl px-4 py-2 ${isSender
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-700 text-white"
                                        }`}
                                >
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <form className="flex mb-5" onSubmit={handleSubmit}>
                <input 
                className="w-full rounded-xl p-2 bg-gray-600" 
                placeholder="Send message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                
                />
            </form>
        </div>
    )
}

export default Messages