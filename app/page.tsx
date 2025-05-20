"use client";
import { redirect } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import app from "@/firebase";

interface User {
  email: string | null;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);

      if (!currentUser) {
        redirect("/login");
      }
      redirect("/dashboard");
    });
    return () => unsubscribe();
  }, []);

  return null;
}
