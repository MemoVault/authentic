"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">MemoVault</h1>
      {!session ? (
        <button
          onClick={handleLogin}
          className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300"
        >
          Login with Google
        </button>
      ) : (
        <>
          <p className="mb-4">Welcome, {session.user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400"
          >
            Logout
          </button>
        </>
      )}
    </main>
  );
}