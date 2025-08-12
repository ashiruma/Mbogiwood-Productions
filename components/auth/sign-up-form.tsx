"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Film, User } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Account...
        </>
      ) : (
        "Join Mbogiwood"
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center mb-4">
          <Film className="h-8 w-8 text-red-600 mr-2" />
          <h1 className="text-3xl font-bold text-white">Mbogiwood</h1>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Create Your Account</h2>
        <p className="text-lg text-gray-400">Join the home of African cinema</p>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">{state.error}</div>
        )}

        {state?.success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
            {state.success}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your full name"
              required
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              required
              className="bg-gray-900 border-gray-700 text-white focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-300">
              I am a...
            </label>
            <Select name="userType" defaultValue="viewer">
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:border-red-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="viewer" className="text-white hover:bg-gray-800">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Film Lover
                  </div>
                </SelectItem>
                <SelectItem value="filmmaker" className="text-white hover:bg-gray-800">
                  <div className="flex items-center">
                    <Film className="h-4 w-4 mr-2" />
                    Filmmaker
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SubmitButton />

        <div className="text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-red-400 hover:text-red-300 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
