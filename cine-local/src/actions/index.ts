"use server";

import { redirect } from "next/navigation";


export async function doLogout() {
  
  redirect("/api/auth/signout?callbackUrl=/");
}


export async function doCredentialLogin(formData: FormData) {
  return { success: false, error: "Server-side credential login not implemented." };
}
