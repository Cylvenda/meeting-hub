"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { FormInput, FieldInput, PasswordInput } from "@/components/customs/form"
import Link from "next/link"


const loginSchema = z.object({
     email: z.string().email("Enter a valid email"),
     password: z.string().min(6, "Password must be at least 6 characters"),
})


type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
     const form = useForm<LoginFormValues>({
          resolver: zodResolver(loginSchema),
          defaultValues: {
               email: "",
               password: "",
          },
     })

     const onSubmit = async (data: LoginFormValues) => {
          console.log("Login Data:", data)

          // await axios.post("/api/auth/login", data, { withCredentials: true })
     }

     return (
          <div className="w-full">
               <FormInput
                    title="Welcome Back"
                    description="Login to your account to continue"
               >
                    <form
                         onSubmit={form.handleSubmit(onSubmit)}
                         className="space-y-5"
                    >
                         {/* EMAIL */}
                         <FieldInput
                              control={form.control}
                              name="email"
                              type="email"
                              label="Email"
                              placeholder="Enter your email"
                         />

                         {/* PASSWORD */}
                         <PasswordInput
                              control={form.control}
                              name="password"
                              label="Password"
                              placeholder="Enter your password"
                              forgetPassword={{
                                   text: "Forgot password?",
                                   location: "/reset",
                              }}
                         />

                         {/* SUBMIT */}
                         <Button type="submit" className="w-full p-5 bg-chart-3 hover:bg-chart-2">
                              Sign In
                         </Button>

                         {/* FOOTER */}
                         <p className="text-center text-sm text-muted-foreground">
                              Don’t have an account?{" "}
                              <Link
                                   href="/register"
                                   className="text-blue-500 hover:underline"
                              >
                                   Sign up
                              </Link>
                         </p>
                    </form>
               </FormInput>
          </div>
     )
}