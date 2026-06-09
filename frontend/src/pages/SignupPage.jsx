import { Link } from "react-router";
import { useState } from "react";


import ChatSvg from '../component/Icon'
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/axios";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });

   const queryClient = useQueryClient()
   const mutation = useMutation({
      mutationFn: async(formData) => {
        try {
          console.log(formData)
          const response = await api.post('/auth/signup',formData)
          console.log(response.data)
          toast.success(response.data.message)
          return response.data
        } catch (error) {
          console.log(error.response.data.message)
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
    <div className='max-w-7xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center  justify-center'>
        <ChatSvg className=' lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
          <ChatSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdOutlineMail />
            <input
              type='email'
              className='grow'
              placeholder='Email'
              name='email'
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className='flex gap-4  flex-wrap'>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <FaUser />
              <input
                type='text'
                className='grow '
                placeholder='Username'
                name='username'
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
          </div>
          <div>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <MdDriveFileRenameOutline />
              <input
                type='text'
                className='grow'
                placeholder='Full Name'
                name='name'
                onChange={handleInputChange}
                value={formData.name}
              />
            </label>
          </div>
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
          <button className='btn rounded-full btn-primary text-white'>{mutation.isPending ? 'Loading...':'Sign up'}</button>
          {mutation.isError && <p className='text-red-500'>Something went wrong</p>}
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-white text-lg'>Already have an account?</p>
          <Link to='/login'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;