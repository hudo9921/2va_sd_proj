import axios from "axios";
import { useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { UserCartGetRequest } from "../types/";

function useGetUserCartQuery() {
  const { accessToken } = useAuth();

  const {
    data: userCart,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    [`get-user-cart-query`],
    async () => {
      const response = await axios.get<UserCartGetRequest>(
        `${Endpoints.BUSINESS_LOGIC}cart/`,
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

  return { userCart, isLoading, isFetching, refetch };
}

export default useGetUserCartQuery;
