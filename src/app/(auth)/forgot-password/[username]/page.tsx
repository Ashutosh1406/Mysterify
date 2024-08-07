'use client'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'
import {useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NextResponse } from 'next/server'

export default function VerifyAccount() {

    const router = useRouter()
    const params = useParams<{username:string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({ //using zod {z} object for inference of "signupschema" for checking 
        //adding resolvers inside "{}"
            resolver:zodResolver(verifySchema),
        }
    )
    const onSubmit = async(data:z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post('/api/verify-code',{
                username: params.username,
                code: data.code,
            })
            console.warn(response.data.status)
            if(response.data.message='Account Verified Successfully'){
                toast({
                    title:"Success",
                    description:response.data.message
                })
                // router.push(`/forgot/reset/${params.username}`)
                // router.push(`/forgot/reset/${response.data.username}`)
                router.push(`/forgot/reset/${params.username}`)
            }
            
            // toast({
            //     title:'Invalid',
            //     description:response.data.message
            // })

        } catch (error) {
            
            console.error("Error in Reseting Password of user",error)
            const axiosError = error as AxiosError<ApiResponse>;
            if(axiosError.response?.status==501){
                toast({
                    title:'Code Has Expired',
                    description: axiosError.response?.data.message,
                    variant:   "destructive"
                })
            }else{
                toast({
                    title:'Invalid Code',
                    description: axiosError.response?.data.message,
                    variant:   "destructive"
                })
            }
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify your account 
            </h1>
            <p className="mb-4">Enter the Verification Code sent to you email</p>
        </div>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
            <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                <Input placeholder="code" {...field} />
                </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <Button type="submit">Submit</Button>
        </form>
    </Form>


        </div>
        </div>

    )
}

// export default VerifyAccount