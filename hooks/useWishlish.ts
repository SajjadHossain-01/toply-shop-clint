import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "@/context/auth-context";


const usewishlist = () => {
  const axiosSecure = useAxiosSecure();
  const { user, isLoading } = useAuth();

  const { data: wishlist = [],refetch } = useQuery({

    queryKey: ["wishlist", user?.email], 
    
    queryFn: async () => {
      
      if (user?.email) {
        const res = await axiosSecure.get(`/wishlist`);
        return res.data;
      }
      
     
      const localwishlist = localStorage.getItem("guest_wishlist");
      return localwishlist ? JSON.parse(localwishlist) : [];
    },
   
    enabled: !isLoading, 
  });

  return [wishlist, refetch];
};

export default usewishlist;