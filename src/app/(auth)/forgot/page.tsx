"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { forgotSchema } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";


// const signUpSchema = z.object({
//     username: z.string().min(1, 'Username is required'),
//   });
  const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof forgotSchema>>({
        resolver: zodResolver(forgotSchema),
        defaultValues: {
          credential:'',
        },
      });
  
    const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post('/api/forgot-password', data); //for db updation of code to reset the password
        //console.log(response);
        toast({
          title: 'Success',
          description: response.data.message,
        });
        router.push(`/forgot-password/${response.data.username}`);
        // if(response.data.message=='Account Verified Successfully') return router.push(`/forgot-password/${response.data.username}`)
        // router.push(`forgot/reset/${response.data.username}`);
      } catch (error) {
        const axiosError = error instanceof AxiosError ? error : new AxiosError();
        let errorMessage =
          axiosError.response?.data.message ||
          'There was a problem with your request. Please try again.';
  
        toast({
          title: 'Request Failed',
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Mysterify
              </h1>
              <p className="mb-4">Forgot Password! No need to worry, we got you!</p>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="credential" //backend
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username or Email</FormLabel>
                      <Input {...field} />
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
                    'Send Mail'
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
  };
  
  export default ForgotPassword;