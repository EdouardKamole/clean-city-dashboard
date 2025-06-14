"use client";
import { redirect } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import app from "@/firebase";
import { Loader2 } from "lucide-react";

interface User {
  email: string | null;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);
      setIsLoading(false);

      if (!currentUser) {
        redirect("/login");
      }
      redirect("/dashboard");
    });
    return () => unsubscribe();
  }, []);

  return isLoading ? (
    <div className="w-screen min-h-screen flex items-center justify-center">
      <Loader2 color="green" className="w-10 h-10 animate-spin" />
    </div>
  ) : null;
}
