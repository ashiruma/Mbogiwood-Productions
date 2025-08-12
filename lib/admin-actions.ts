"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveFilm(filmId: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("films").update({ status: "published" }).eq("id", filmId)

  if (error) {
    throw new Error("Failed to approve film")
  }

  revalidatePath("/admin/films")
  return { success: true }
}

export async function rejectFilm(filmId: string, reason?: string) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("films")
    .update({
      status: "archived",
      // In a real app, you might want to store the rejection reason
    })
    .eq("id", filmId)

  if (error) {
    throw new Error("Failed to reject film")
  }

  revalidatePath("/admin/films")
  return { success: true }
}

export async function verifyFilmmaker(profileId: string) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("filmmaker_profiles")
    .update({ verification_status: "verified" })
    .eq("id", profileId)

  if (error) {
    throw new Error("Failed to verify filmmaker")
  }

  revalidatePath("/admin/verification")
  return { success: true }
}

export async function rejectFilmmaker(profileId: string, reason?: string) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("filmmaker_profiles")
    .update({ verification_status: "rejected" })
    .eq("id", profileId)

  if (error) {
    throw new Error("Failed to reject filmmaker")
  }

  revalidatePath("/admin/verification")
  return { success: true }
}

export async function suspendUser(userId: string) {
  const supabase = createServerClient()

  // In a real app, you might want to add a suspended status to users table
  const { error } = await supabase
    .from("users")
    .update({
      // Add suspended field to users table schema
      // suspended: true
    })
    .eq("id", userId)

  if (error) {
    throw new Error("Failed to suspend user")
  }

  revalidatePath("/admin/users")
  return { success: true }
}
