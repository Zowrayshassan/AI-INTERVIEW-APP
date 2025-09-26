"use client";

import useRouter from "next/navigation";
import Interviewlist from "./_components/interviewlist";
import Options from "./_components/options";
const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session checking logic here
  }, [router]);

  return (
    <div>
      <Options />
      <Interviewlist />
    </div>
  );
};

export default Page;
