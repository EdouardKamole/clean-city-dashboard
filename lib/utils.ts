import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "@/firebase";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/checkUserRole.ts

export async function checkUserRole(): Promise<{
  isAdmin: boolean;
  uid: string | null;
}> {
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      // No authenticated user
      return { isAdmin: false, uid: null };
    }

    const uid = user.uid;
    const db = getFirestore(app);
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // User document not found
      return { isAdmin: false, uid };
    }

    const userRole = userDocSnap.data().role || "user";
    return { isAdmin: userRole === "admin", uid };
  } catch (error) {
    console.error("Error checking user role:", error);
    return { isAdmin: false, uid: null };
  }
}
