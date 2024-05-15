'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, LoaderCircleIcon } from "lucide-react"


const Page = () => {

  // states 
  /* using deboucing for checking username avalibility */

  const [username,setUsername] = useState('') //nothing inside '' username
  const [usernameMessage,setUsernameMessage] = useState('') 
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  //using debouce hook

  const deboucedUsername = useDebounceValue(username,300)
  const { toast } = useToast()
  const router = useRouter();

  //notes 
  //zod implementation

  //This "form" method is used for destructuring in render() of <Form></Form>
  const form = useForm<z.infer<typeof signUpSchema>>({ //using zod {z} object for inference of "signupschema" for checking 
    //adding resolvers inside "{}"
      resolver:zodResolver(signUpSchema),
      defaultValues:{  //default set using ts and zod for validation
        username:'',
        email:'',
        password:'',
      }
  })

  //writing hook{useEffect} for checking user availibilty using check-unique-username

  useEffect( () => {
    const checkUsernameUniqueness = async() => {
      if(deboucedUsername){ //for first time
        setIsCheckingUsername(true)
        setUsernameMessage('')

        try {
          const response = await axios.get<ApiResponse>( `/api/check-unique-username?username=${deboucedUsername}`)

          //response got by axios has data and message from backend
          console.log("*******JajAPPAN AXIOS RESPONSE*****",response)
          setUsernameMessage(response.data.message)
        } catch (error) {
            //USING ERROR HANDLING with axios
            const axiosError = error as AxiosError<ApiResponse>; //using interface of apiresponse
            setUsernameMessage(
              axiosError.response?.data.message ?? "Error checking Username"
            );
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUniqueness();
  } , [deboucedUsername]);

  const onSubmit = async(data:z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        console.log("******Jajsappan 'onsubmit event'data from subMIT handler", data) 
        try {
          const response = await axios.post<ApiResponse>('/api/sign-up',data)
          toast({
            //ctrl + spc
            title:'Success',
            description: response.data?.message
          })
          router.replace(`/verify/${username}`) //page redirect
          setIsSubmitting(false)
        } catch (error) {
          console.error("Error in signup of user",error)
          const axiosError = error as AxiosError<ApiResponse>;
          let errorMessage = axiosError.response?.data.message

          toast({
            title:'Signup Failed',
            description: errorMessage,
            variant:   "destructive"
          })
          setIsSubmitting(false)
        }
    };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mysterify
          </h1>
          <p className="mb-4">Sign Up to start your anonymous & Secret Adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
          <FormField
          name="username"
          control={form.control}
          render={({ field }) => ( //render starts
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                //inserting values:
                onChange={(e)=>{
                  field.onChange(e)
                  setUsername(e.target.value)
                }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

          <FormField
          name="email"
          control={form.control}
          render={({ field }) => ( //render starts
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email"
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
                <Input type="password" placeholder="password" {...field} 
                //inserting values:
                onChange={(e)=>{
                  field.onChange(e)
                  setUsername(e.target.value)
                }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

          <Button type="submit" disabled={isSubmitting}>

            {
              isSubmitting ? (
                <>
                <Loader2 className="mr-2-h-4 w-4 animate-spin" />Please wait
                </>
              ) : ('Signup')
            }

          </Button>

          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member? {''}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">

            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page