// "use client";

// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast, useToast } from "@/components/ui/use-toast";
// import axios, { AxiosError } from "axios";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { resetSchema } from "@/schemas/signUpSchema";
// import { NextResponse } from "next/server";


// // const signUpSchema = z.object({
// //     username: z.string().min(1, 'Username is required'),
// //   });
//   const resetPassword = () => {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const router = useRouter();
//     const form = useForm<z.infer<typeof resetSchema>>({
//         resolver: zodResolver(resetSchema),
//         defaultValues: {
//           password1:password1,
//           password2:password2,
//         },
//       });
  
//     const onSubmit = async (data: z.infer<typeof resetSchema>) => {
//       setIsSubmitting(true);
//       try {

//         if(form.password1!=form.password2){

//         }
//         const response = await axios.post('/api/forgot-password', data); //for db updation of code to reset the password
//         //console.log(response);
//         toast({
//           title: 'Success',
//           description: response.data.message,
//         });
//         router.replace(`/forgot-password/${response.data.username}`);
//         // router.push(`/auth/forgot/reset/${response.data.username}`);
//       } catch (error) {
//         const axiosError = error instanceof AxiosError ? error : new AxiosError();
//         let errorMessage =
//           axiosError.response?.data.message ||
//           'There was a problem with your request. Please try again.';
  
//         toast({
//           title: 'Request Failed',
//           description: errorMessage,
//         });
//       } finally {
//         setIsSubmitting(false);
//       }
//     };
  
//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-800">
//           <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//             <div className="text-center">
//               <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//                 Mysterify
//               </h1>
//               <p className="mb-4">Forgot Password! No need to worry, we got you!</p>
//             </div>
//             <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <FormField
//                   name="password1" //backend
//                   control={form.control}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <Input {...field} />
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   name="password2" //backend
//                   control={form.control}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Confirm Password</FormLabel>
//                       <Input {...field} />
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button type="submit" className="w-full" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Please wait
//                     </>
//                   ) : (
//                     'Reset'
//                   )}
//                 </Button>
//               </form>
//             </Form>
//             <div className="text-center mt-4">
//               <p>
//                 Already a member?{' '}
//                 <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       );
//   };
  
//   export default resetPassword;


// 'use client';

// import { ApiResponse } from '@/types/ApiResponse';
// import { zodResolver } from '@hookform/resolvers/zod';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDebounceValue } from '@/app/(auth)/sign-up/script';
// import * as z from 'zod';

// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/use-toast';
// import axios, { AxiosError } from 'axios';
// import { Loader2 } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import { resetSchema } from '@/schemas/signUpSchema';

// export default function ResetPassword() {
//   const [username, setUsername] = useState('');
//   const [usernameMessage, setUsernameMessage] = useState('');
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const debouncedUsername = useDebounceValue(username, 300);

//   const router = useRouter();
//   const params = useParams<{username:string}>()
//   const { toast } = useToast();

//   const form = useForm<z.infer<typeof resetSchema>>({
//     resolver: zodResolver(resetSchema),
//     defaultValues: {
//      username:params.username,
//      password1:'',
//      password2:'',
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof resetSchema>) => {
//     setIsSubmitting(true);
//     //console.log("Form submission started", data);
//     try {
//       const response = await axios.post<ApiResponse>('/api/reset-password', data);
//       console.log("This is my response from axios post request*******",response)
//       //console.log("Form submission success", response);

//       toast({
//         title: 'Success , Password Changed Successfully',
//         description: response.data.message,
//       });

//       router.replace(`/sign-in`);
//       //console.log("Navigating to", `/verify/${data.username}`);
//     } catch (error) {
//       console.error('Error while changing Password', error);

//       const axiosError = error as AxiosError<ApiResponse>;
//       const errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.';

//       toast({
//         title: "Password Change Request Couldn't be Processed at the Moment. Please Try After Sometime :)",
//         description: errorMessage,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-800">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Mysterify
//           </h1>
//           <p className="mb-4">Hello,We Got You!</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* <FormField
//               name="username"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <Input
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       setUsername(e.target.value);
//                     }}
//                   />
//                   {isCheckingUsername && <Loader2 className="animate-spin" />}
//                   {!isCheckingUsername && usernameMessage && (
//                     <p
//                     className={`text-sm font-semibold ${
//                       usernameMessage === 'Username is Available'
//                         ? 'text-green-500'
//                         : 'text-red-500'
//                     }`}
//                   >
//                     {usernameMessage}
//                   </p>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             /> */}
//             <FormField
//               name="password1"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>New Password</FormLabel>
//                   <Input {...field} name="email" />
//                   {/* <p className="text-muted text-gray-400 text-sm">
//                     We will send you a verification code
//                   </p> */}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               name="password2"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <Input type="password" {...field} name="password" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="w-full" disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Please wait
//                 </>
//               ) : (
//                 'Sign Up'
//               )}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { ApiResponse } from '@/types/ApiResponse';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';

// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/use-toast';
// import axios, { AxiosError } from 'axios';
// import { Loader2 } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import { resetSchema } from '@/schemas/signUpSchema';
// import { useSession } from 'next-auth/react';

// export default function ResetPassword() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();
//   const params = useParams<{username:string}>()
//   const { toast } = useToast();

//   const { data: session, status } = useSession();
//   const [tokenValid,setTokenValid] = useState(false)
//   const [message,setMessage] = useState('')


//   const form = useForm<z.infer<typeof resetSchema>>({
//     resolver: zodResolver(resetSchema),
//     defaultValues: {
//       username: params.username,
//       password1: '',
//       password2: '',
//     },
//   });

//   useEffect(() => {
//     const validateToken = async () => {
//       const resetToken = session?.user?.resetToken;
//       if (resetToken) {
//         try {
//           const response = await axios.post('/api/validate-reset-token', { token: resetToken });
//           if (response.status === 200) {
//             setTokenValid(true);
//           }
//         } catch (error) {
//           setMessage('Invalid or expired token');
//           // Redirect user if token is invalid or expired
//           router.replace('/'); // Redirect to home page or any other appropriate page
//         }
//       } else {
//         // Redirect user if reset token is not found in the session
//         router.replace('/'); // Redirect to home page or any other appropriate page
//       }
//     };

//     validateToken();
//   }, [session, router]);

//   const onSubmit = async (data: z.infer<typeof resetSchema>) => {
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post<ApiResponse>('/api/reset-password', data);
//       toast({
//         title: 'Success',
//         description: response.data.message,
//       });
//       router.replace('/');
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       const errorMessage = axiosError.response?.data.message || 'There was a problem with your request. Please try again.';

//       toast({
//         title: "Password Change Request Failed",
//         description: errorMessage,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-800">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Mysterify
//           </h1>
//           <p className="mb-4">Hello, We Got You!</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="password1"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>New Password</FormLabel>
//                   <Input {...field} type="password" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="password2"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Confirm Password</FormLabel>
//                   <Input {...field} type="password" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="w-full" disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Please wait
//                 </>
//               ) : (
//                 'Reset Password'
//               )}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }



'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { resetSchema } from '@/schemas/signUpSchema';
import { useSession } from 'next-auth/react';

export default function ResetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const [isValidating,setIsValidating] = useState(false)
  const [tokenValid,setTokenValid] = useState(false)

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      username: params.username,
      password1: '',
      password2: '',
    },
  });

  // useEffect(()=>{
  //   const validateToken = async() => {
  //     try {
  //         const response = await axios.post(`/api/validate-token`,{
  //           body:{username:params.username},
  //         })
  //         if(response.data.message==='Token is Valid'){
  //           setTokenValid(true);
  //         }else{
  //           toast({
  //             title:'UnAuthorised Request',
  //             description:response.data.message,
  //             variant:'destructive',
  //           });
  //         }
  //     } catch (error) {
  //         const axiosError = error as AxiosError<ApiResponse>;
  //         toast({
  //             title:'Token Validation Failed',
  //             description:axiosError.response?.data.message,
  //             variant:'destructive',
  //         })
  //     }finally{
  //       setIsValidating(false)
  //     }
  //   };
  //   validateToken();
  // },[params.username,toast])

  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/reset-password', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.replace('/');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || 'There was a problem with your request. Please try again.';

      toast({
        title: "Password Change Request Failed",
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (isValidating) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-gray-800">
  //       <Loader2 className="h-10 w-10 animate-spin text-white" />
  //     </div>
  //   );
  // }

  // if (!tokenValid) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-gray-800">
  //       <p className="text-white text-lg">Unauthorized request. Please try again.</p>
  //     </div>
  //   );
  // }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Mysterify
          </h1>
          <p className="mb-4">Hello, We Got You!</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="password1"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <Input {...field} type="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password2"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input {...field} type="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
