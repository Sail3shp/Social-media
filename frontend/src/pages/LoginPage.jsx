import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/axios";
import toast from "react-hot-toast";
import { Section } from "../component/Robot";

import ChatSvg from "../component/Icon";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const queryClient = useQueryClient()
	const mutation = useMutation({
      mutationFn: async(formData) => {
        try {
          console.log(formData)
          const response = await api.post('/auth/login',formData)
		  localStorage.setItem('token',response.data.token)
          toast.success(response.data.message)
          return response.data
        } catch (error) {
          console.log(error.response.message)
          toast.error(error.response.data.message)
        }
      },
	  onSuccess: () => {
		queryClient.invalidateQueries({queryKey:['user']})
	  }
    })

	const handleSubmit = (e) => {
		e.preventDefault();
		mutation.mutate(formData)
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className=' flex h-screen w-full'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<Section />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<ChatSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='john@email.com'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{mutation.isPending? 'Loading...':'Log In'}</button>
					{mutation.isError && <p className='text-red-500'>Something went wrong</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;