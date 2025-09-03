import { useEffect } from "react";
import { supabase } from "./lib/supbaseClient";

const Provider = ({ children }) => {
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log(user); // <-- this should log {} if no user, or user object if logged in

    if (user) {
      const { data: Users, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user.email);

      console.log("Users table result:", Users);
    }
  };

  return <div>{children}</div>;
};

export default Provider;
