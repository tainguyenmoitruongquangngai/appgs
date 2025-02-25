import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import HomeScreen from "@/screens/HomeScreen";

export default function Index() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isLoggedIn) {
        router.replace("/login");
      }
    }
  }, [isMounted, isLoggedIn]);

  return isLoggedIn ? <HomeScreen /> : null;
}
