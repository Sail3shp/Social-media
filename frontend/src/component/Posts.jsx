import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { POSTS } from "../utils/dummy";
import { useQueryClient,useQuery } from "@tanstack/react-query";
import { api } from "../utils/axios";

const Posts = () => {
	const queryClient = useQueryClient()
	const {data:posts,isLoading,isError,isSuccess} = useQuery({ queryKey: ['posts'], queryFn: async() => {
		const response = await api.get('/post')
		return response.data
	} })
	console.log(posts?.data)

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts?.data && (
				<div>
					{posts?.data.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;