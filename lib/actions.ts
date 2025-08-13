"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { notificationService } from "@/lib/notifications"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")
  const role = formData.get("role")
  const companyName = formData.get("companyName")

  if (!email || !password || !fullName || !role) {
    return { error: "All required fields must be filled" }
  }

  const supabase = createClient()

  try {
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    // Create profile if user was created
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: email.toString(),
        full_name: fullName.toString(),
        role: role.toString(),
        company_name: companyName?.toString() || null,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return { error: "Account created but profile setup failed. Please contact support." }
      }

      await notificationService.createNotification({
        user_id: authData.user.id,
        title: "¡Bienvenido a la plataforma!",
        message: `Tu cuenta como ${role.toString().replace("_", " ")} ha sido creada exitosamente. Explora las oportunidades de contratación disponibles.`,
        type: "success",
      })
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const fullName = formData.get("fullName")
  const companyName = formData.get("companyName")
  const phone = formData.get("phone")

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName?.toString(),
        company_name: companyName?.toString(),
        phone: phone?.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard/profile")
    return { success: "Profile updated successfully" }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "Failed to update profile" }
  }
}
