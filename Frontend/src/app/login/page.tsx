"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Next.js API URL
const NEXT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const HOME_PATH = '/';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${NEXT_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.statusText}`);
      }

      // Redirect to HOME_PATH after login
      console.log(`Login successful, redirecting to ${HOME_PATH}`);
      router.push(HOME_PATH);
      router.refresh();

    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
       setIsLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${NEXT_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${response.statusText}`);
      }

      // Redirect to HOME_PATH after registration
      console.log(`Registration successful, redirecting to ${HOME_PATH}`);
      router.push(HOME_PATH);
      router.refresh();

    } catch (error: any) {
      console.error("Registration error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-border border-4 flex items-center justify-center w-screen relative" style={{ height: "calc(100vh - 58px)" }}>
      <Tabs defaultValue="login" className="w-[400px] h-full py-24">
        <TabsList className="grid w-full grid-cols-2 border-none">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="create">Create Account</TabsTrigger>
        </TabsList>

        {/* Login tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Log in to your existing account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                     <FormItem>
                       <FormLabel>Email Address</FormLabel>
                       <FormControl>
                         <Input type="email" {...field} disabled={isLoading} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                  )} />
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                     <FormItem>
                       <FormLabel>Password</FormLabel>
                       <FormControl>
                         <Input type="password" {...field} disabled={isLoading} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                  )} />
                  <div>
                    <Button type="submit" className="w-full my-2" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registration tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Create a new account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField control={registerForm.control} name="name" render={({ field }) => (
                     <FormItem>
                       <FormLabel>Name</FormLabel>
                       <FormControl>
                         <Input {...field} disabled={isLoading}/>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                  )} />
                  <FormField control={registerForm.control} name="email" render={({ field }) => (
                    <FormItem>
                       <FormLabel>Email Address</FormLabel>
                       <FormControl>
                         <Input type="email" {...field} disabled={isLoading} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                  )} />
                  <FormField control={registerForm.control} name="password" render={({ field }) => (
                     <FormItem>
                       <FormLabel>Password</FormLabel>
                       <FormControl>
                         <Input type="password" {...field} disabled={isLoading} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                  )} />
                  <div>
                    <Button type="submit" className="w-full my-2" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
