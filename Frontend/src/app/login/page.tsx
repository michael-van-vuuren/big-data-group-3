"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form";
import { Input } from "@/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// SCHEMAS for the forms (validates inputs)
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm({ resolver: zodResolver(registerSchema) });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const status = localStorage.getItem("registration-status");
    if (status) {
      setRegistrationStatus(status);
      localStorage.removeItem("registration-status");
    }
  }, []);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoginError(null);
    try {
      const userData = await authApi.loginUser(values);

      if (!userData) {
        throw new Error("No user data returned.");
      }
      login(userData);

      // might be buggy? 
      router.replace("/");
      router.refresh();

    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(error.message || "Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>, role: "USER" | "BUSINESS") => {
    setRegisterError(null);
    try {
      await authApi.registerUser({ ...values, role });
      localStorage.setItem("registration-status", "Account created successfully! Please log in below:");
      registerForm.reset();

      location.reload();
    } catch (error: any) {
      console.error("Registration failed:", error);
      setRegisterError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="cosmic-bg border-border border-4 flex items-center justify-center w-screen relative" style={{ height: "calc(100vh - 58px)" }}>
      <Tabs defaultValue="login" className="w-[90%] sm:w-[75%] md:w-[60%] lg:w-[45%]">
        <TabsList className="grid w-full grid-cols-2 border-none">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader><CardTitle>Log In</CardTitle></CardHeader>
            <CardContent>
              {registrationStatus && <p className="text-sm font-medium pb-2">{registrationStatus}</p>}
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {loginError && <p className="text-sm font-medium text-destructive">{loginError}</p>}
                  <Button type="submit" className="w-full my-2" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register" className="px-4 sm:px-8 md:px-10 lg:px-16 pb-16 grid-bg-dark">
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4 shadow-light">
              <TabsTrigger value="user">Personal Account</TabsTrigger>
              <TabsTrigger value="business">Business Account</TabsTrigger>
            </TabsList>

            {/* Personal Account */}
            <TabsContent value="user" className="border-b-2 shadow-light">
              <Card>
                <CardHeader><CardTitle>Create Personal Account</CardTitle></CardHeader>
                <CardDescription>Create an account to explore the Cosmic Coffee Catalog!</CardDescription>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit((values) => handleRegister(values, "USER"))} className="space-y-4">
                      <FormField control={registerForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={registerForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={registerForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      {registerError && <p className="text-sm font-medium text-destructive">{registerError}</p>}
                      <Button type="submit" className="w-full my-2" disabled={registerForm.formState.isSubmitting}>
                        {registerForm.formState.isSubmitting ? 'Creating...' : 'Create Personal Account'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Account */}
            <TabsContent value="business" className="border-b-2 shadow-light">
              <Card>
                <CardHeader><CardTitle>Create Business Account</CardTitle></CardHeader>
                <CardDescription>Add your products to the Cosmic Coffee Catalog.</CardDescription>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit((values) => handleRegister(values, "BUSINESS"))} className="space-y-4">
                      <FormField control={registerForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={registerForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={registerForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      {registerError && <p className="text-sm font-medium text-destructive">{registerError}</p>}
                      <Button type="submit" className="w-full my-2" disabled={registerForm.formState.isSubmitting}>
                        {registerForm.formState.isSubmitting ? 'Creating...' : 'Create Business Account'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );

}
