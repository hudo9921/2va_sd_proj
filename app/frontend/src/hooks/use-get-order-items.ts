import axios from "axios";
import { useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { Order } from "../types/";

function useGetOrderItems(orderId: number) {
  const { accessToken } = useAuth();

  const {
    data: orderItems,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    [`get-order-items`],
    async () => {
      const response = await axios.get<Order[]>(
        `${Endpoints.BUSINESS_LOGIC}orders/${orderId}`,
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
    }
  );

  return { orderItems, isLoading, isFetching, refetch };
}

export default useGetOrderItems;
