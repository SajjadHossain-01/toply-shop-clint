import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "@/context/auth-context";


const useCart = () => {
  const axiosSecure = useAxiosSecure();
  const { user, isLoading } = useAuth();

  const { refetch, data: cart = [] } = useQuery({
    // queryKey-তে user.email বা user.uid দেওয়া জরুরি, যাতে ইউজার চেঞ্জ হলে কার্ট অটো রিফ্রেশ হয়
    queryKey: ["cart", user?.email], 
    
    queryFn: async () => {
      // ১. ইউজার যদি লগইন করা থাকে, তবে ডাটাবেজ (API) থেকে কার্ট ডাটা আনবে
      if (user?.email) {
        const res = await axiosSecure.get(`/cart`); // আপনার API স্ট্রাকচার অনুযায়ী ইউআরএল মিলিয়ে নেবেন
        return res.data;
      }
      
      // ২. ইউজার যদি লগইন করা না থাকে (Guest User), তবে ব্রাউজারের LocalStorage থেকে ডাটা আনবে
      const localCart = localStorage.getItem("guest_cart");
      return localCart ? JSON.parse(localCart) : [];
    },
   
    enabled: !isLoading, 
  });

  return [cart, refetch];
};

export default useCart;