import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../utils/axios"
import {toast} from 'react-hot-toast'

export const useFollow = () => {
    const queryClient = useQueryClient()

    const {mutate:follow,isPending} = useMutation({
        mutationFn: async(id) => {
            try {
                const res = await api.post(`/auth/follow/${id}`)
                return res.data
            } catch (error) {
                console.log(error)
                throw new Error(error.message)
            }
        },
        onSuccess: (res) => {
            console.log(res)
            toast.success(res.message)
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["userDetail"] }),
                queryClient.invalidateQueries({queryKey:['user']})
			]);
		},
        onError: (error) => {
			toast.error(error.message);
		},
    })
    return {follow,isPending}
}