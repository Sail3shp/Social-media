import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { POSTS } from "../utils/dummy";
import { useQueryClient,useQuery } from "@tanstack/react-query";
import { api } from "../utils/axios";
import { useEffect } from "react";

const Posts = ({feedType,username,userId}) => {

	const getFeed = () => {
		switch (feedType) {
			case 'forYou':
				return '/post'
			case 'following':
				return '/post/following'
			case 'posts':
				return `/post/users/${username}`
			case 'likes':
				return `/post/likes/${userId}`
				
			default:
				return '/post';
		}
	}

	const POST_ENDPOINT = getFeed()

	const queryClient = useQueryClient()

	const {data:posts,isLoading,isError,isSuccess,refetch,isRefetching} = useQuery({ queryKey: ['posts'], queryFn: async() => {
		const response = await api.get(POST_ENDPOINT)
		return response.data
	} })

	useEffect(() => {
		refetch()
	},[refetch,feedType,username])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading &&!isRefetching && posts?.data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts?.data && (
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