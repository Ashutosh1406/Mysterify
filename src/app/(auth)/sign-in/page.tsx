'use client'
// import { useDebounceValue } from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
// import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from 'react'; //for button


export default function SignInForm(){

  // states 
  /* using deboucing for checking username avalibility */

  //using debouce hook

  //const deboucedUsername = useDebounceValue(username,300)
  //const { toast } = useToast()
  const router = useRouter();

  //notes 
  //zod implementation

  //This "form" method is used for destructuring in render() of <Form></Form>

  const form = useForm<z.infer<typeof signInSchema>>({       //using zod {z} object for inference of "signupschema" for checking 
                                                             //adding resolvers inside "{}"
      resolver:zodResolver(signInSchema),
      defaultValues:{  //default set using ts and zod for validation
        identifier:'',
        password:'',
      }
  });
      const {toast} = useToast()
  const onSubmit = async(data:z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials',{
          redirect:false,
          identifier: data.identifier,
          password: data.password
        })
        console.log("This is result",result);

        if(result?.error){
          toast({
            title:'Login Failed',
            description:'Incorrect username or password',
            variant:'destructive'
          })
        } 

        if(result?.url){
          router.replace('/dashboard')
        }
      }
    
  
  //const MyComponent = () => {}
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mysterify
          </h1>
          <p className="mb-4">Sign In to start your anonymous & Secret Adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => ( //render starts
            <FormItem>
              <FormLabel>Email/username</FormLabel>
              <FormControl>
                <Input placeholder="email/username"
                {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          name="password"
          control={form.control}
          render={({ field }) => ( //render starts
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" 
                {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

          <Button type="submit" >
          Signin
          </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
      <p>
        <span className={`transition duration-200 ${isHovered ? 'fade-out' : ''}`}>
          Join Now!!
        </span>
        <Link href="/sign-up">
          <button
            className={`ml-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 transform ${isHovered ? '-translate-x-10' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Sign-up
          </button>
        </Link>
      </p>
    </div>
      </div>
    </div>
  )
  
  }


//export default Page

// import React from 'react'

// function page() {
//   return (
//     <div>sign-in-page</div>
//   )
// }

// export default page