"use server"

import { revalidatePath } from "next/cache"

export async function updateProfile(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName")
  const companyName = formData.get("companyName")
  const phone = formData.get("phone")

  try {
    // Mock profile update for demo purposes
    console.log("Profile update:", { fullName, companyName, phone })

    revalidatePath("/dashboard/profile")
    return { success: "Profile updated successfully" }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "Failed to update profile" }
  }
}
