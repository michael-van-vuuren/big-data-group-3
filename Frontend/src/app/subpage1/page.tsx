// pages/subpage1.tsx
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

const Subpage1 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-6">
        <h1 className="text-xl font-bold">Login before taking the quiz</h1>
        <div className="flex flex-col items-center space-y-4">
          <Input className="w-[200px]" type="email" placeholder="Email" />
          <Input className="w-[200px]" type="password" placeholder="Password" />
          {/* Submit button */}
          <Button className="w-[200px]" type="submit">Submit</Button>
        </div>
      </div>
    </div>
  )
}

export default Subpage1
