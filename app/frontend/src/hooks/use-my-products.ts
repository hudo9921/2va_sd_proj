import axios from "axios";
import { useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { ProductGetRequest } from "../types/";
import { useAuth } from "../context";

function useMyProducts(
  offset: number = 10,
  search: string = "",
  category: string = "",
  festivity: string = ""
) {
  const { accessToken } = useAuth();

  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    [`my-products`, category, festivity],
    async () => {
      const response = await axios.get<ProductGetRequest>(
        `${Endpoints.BUSINESS_LOGIC}my_products`,
        {
          params: {
            limit: 10,
            offset: offset,
            search: search,
            category: category,
            festivity,
          },
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

  return { products, isLoading, isFetching, refetch };
}

export default useMyProducts;
