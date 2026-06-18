"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";
import * as bcrypt from "bcryptjs";

export async function loginAdmin(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email dan password wajib diisi." };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: "Kredensial login tidak cocok." };
    }

    // Verify password hash
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "Kredensial login tidak cocok." };
    }

    // Verify role is ADMIN
    if (user.role !== "ADMIN") {
      return { success: false, error: "Akses ditolak. Anda bukan Administrator." };
    }

    // Create session cookie
    await createSession(user.id, user.role);

    return { success: true };
  } catch (error) {
    console.error("Admin login Server Action failed:", error);
    return { success: false, error: "Terjadi kesalahan internal. Silakan coba lagi." };
  }
}

export async function logoutAdmin() {
  await deleteSession();
  return { success: true };
}
