"use client";
import { useContext, useEffect, useState } from "react";
import { userContext } from "./context/userContext";
import { supabase } from "./lib/supbaseClient";

const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  // check supabase auth + add to table
  const syncUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log("Error getting user:", error.message);
      return;
    }

    const currentUser = data.user;

    if (currentUser) {
      // check if already in table
      const { data: rows } = await supabase
        .from("Users")
        .select("*")
        .eq("email", currentUser.email);

      // if not, insert
      if (!rows || rows.length === 0) {
        await supabase.from("Users").insert([
          {
            name: currentUser.user_metadata?.name || "",
            email: currentUser.email,
            pictures: currentUser.user_metadata?.pictures || "",
          },
        ]);
      }

      setUser(currentUser);
      console.log(currentUser);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUser();
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export default Provider;

export const useUser = () => {
  const context = useContext(userContext);
  return context; // returns { user, setUser }
};
