"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"


export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1️⃣ Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const userId = data.user?.id

    if (!userId) {
      alert("User not created")
      setLoading(false)
      return
    }

    let imageUrl = ""

    // 2️⃣ Upload profile image (if provided)
    if (profileImage) {
      const fileExt = profileImage.name.split(".").pop()
      const fileName = `${userId}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, profileImage, {
          upsert: true,
        })

      if (uploadError) {
        alert(uploadError.message)
        setLoading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    // 3️⃣ Insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: fullName,
        contact_no: contactNo,
        profile_url: imageUrl,
        email: email,
      })

    if (profileError) {
      alert(profileError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    alert("Account created successfully")
    router.push("/login")
  }

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md mx-auto mt-20 space-y-4 border p-6 rounded shadow"
    >
      <h1 className="text-2xl font-bold text-center">
        Create Account
      </h1>

      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 w-full"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Contact Number"
        className="border p-2 w-full"
        value={contactNo}
        onChange={(e) => setContactNo(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        className="border p-2 w-full"
        onChange={(e) =>
          e.target.files && setProfileImage(e.target.files[0])
        }
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  )
}
