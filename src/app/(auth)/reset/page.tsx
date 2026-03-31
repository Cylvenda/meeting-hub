"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { ResetFormSchema } from "@/components/schema/user-form-schema"
import { FieldInput, FormInput } from "@/components/customs/form"
import { Button } from "@/components/ui/button"

type ResetFormValues = z.infer<typeof ResetFormSchema>

const ForgetPassword = () => {
     const form = useForm<ResetFormValues>({
          resolver: zodResolver(ResetFormSchema),
          defaultValues: {
               email: "",
          },
     })

     const handleSubmit = (data: ResetFormValues) => {
          console.log(data)
     }

     return (
          <div className="flex items-center justify-center px-4">

               <div className="w-full max-w-md">
                    <FormInput
                         title="Reset Password"
                         description="Enter your email and we’ll send you a reset link"
                         className="border-0! shadow-none! ring-0! bg-transparent"
                    >
                         <form
                              onSubmit={form.handleSubmit(handleSubmit)}
                              className="space-y-5 mt-4"
                         >
                              {/* EMAIL */}
                              <FieldInput
                                   name="email"
                                   control={form.control}
                                   type="email"
                                   placeholder="Enter your email address"
                                   label="Email Address"
                              />

                              {/* LINKS */}
                              <div className="flex justify-between text-sm">
                                   <Link
                                        href="/login"
                                        className="text-blue-500 hover:underline"
                                   >
                                        Back to Login
                                   </Link>

                                   <Link
                                        href="/register"
                                        className="text-blue-500 hover:underline"
                                   >
                                        Create account
                                   </Link>
                              </div>

                              {/* SUBMIT */}
                              <Button
                                   type="submit"
                                   className="w-full bg-chart-3 hover:opacity-90 transition p-5"
                              >
                                   Send Reset Link
                              </Button>
                         </form>
                    </FormInput>
               </div>
          </div>
     )
}

export default ForgetPassword