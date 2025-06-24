"use server"

import { signOut } from "next-auth/react"

export const userSignOut = async () => {
    await signOut({redirect: false})
}
