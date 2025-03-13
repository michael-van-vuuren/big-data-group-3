import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs defaultValue="create" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Account</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                If you do not already have an account, create one here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="@peduarte@gmail.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" defaultValue="Password1234!" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="noShadow" className="w-full bg-bw text-text">
                Create Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login to your existing account here. 
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="noShadow" className="w-full bg-bw text-text">
                Login
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
