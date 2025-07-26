import axios from "axios";
import { useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { OrderWithOrderItems } from "../types/";

function useGetUserOrders() {
  const { accessToken } = useAuth();

  const {
    data: useOrders,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    [`get-user-orders`],
    async () => {
      const response = await axios.get<OrderWithOrderItems[]>(
        `${Endpoints.BUSINESS_LOGIC}orders/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      refetchInterval: 1500, 
    }
  );

  return { useOrders, isLoading, isFetching, refetch };
}

export default useGetUserOrders;
