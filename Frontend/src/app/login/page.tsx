"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();

  // 🧠 State for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 🧠 State for Registration
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login status on mount
  useEffect(() => {
    const session = localStorage.getItem("loggedIn");
    if (session === "true") setIsLoggedIn(true);
  }, []);

  // ✅ Simulated Login
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Logged in successfully!");
        localStorage.setItem("loggedIn", "true");
        setIsLoggedIn(true);
        setTimeout(() => router.push("/quiz"), 1000);
      } else {
        setMessage(result.error || "❌ Invalid login credentials.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    }
  };

  // ✅ Simulated Account Creation
  const handleCreate = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          password: createPassword,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Account created successfully!");
      } else {
        setMessage(result.error || "❌ Account creation failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    setMessage("✅ Logged out successfully.");
  };

  return (
    <div className="border-border border-4 bg-white flex items-center justify-center w-screen relative" style={{ height: "calc(100vh - 58px)" }}>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 border-none">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="create">Create Account</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your existing account here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogin} className="w-full bg-bw text-text">
                Login
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Create Account Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>If you do not already have an account, create one here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="register-email">Email Address</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreate} className="w-full bg-bw text-text">
                Create Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message display */}
      {message && (
        <p className="text-center mt-4 text-red-600 absolute bottom-10 w-full">
          {message}
        </p>
      )}

      {/* Logout Button */}
      {isLoggedIn && (
        <Button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-600 text-white"
        >
          Logout
        </Button>
      )}
    </div>
  );
}
