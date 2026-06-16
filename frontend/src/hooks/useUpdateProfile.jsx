import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { api } from "../utils/axios"
export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const {mutateAsync:updateProfile,isPending:isUpdatingProfile} = useMutation({
            mutationFn: async(data) => {
                try {
                    const res = await api.post('/auth/update',data)
                    console.log(res,res.data)
                    return res.data
                } catch (error) {
                    console.log(error)
                    throw new Error(error.message)
                }
            },
            onSuccess:async() => {
                toast.success('profile updated successfully')
                Promise.all([
                    await queryClient.invalidateQueries({queryKey:['user']}),
                    await queryClient.invalidateQueries({queryKey:['userDetail']})
                ])
                
            }
        })
    return {
        updateProfile,
        isUpdatingProfile
    }
}