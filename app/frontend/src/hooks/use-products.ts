import axios from "axios";
import { useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { ProductGetRequest } from "../types/";

function useProducts(offset: number = 10, search: string = '', category: string = '') {
  const {
    data: products,
    isLoading,
    isFetching,
    refetch
  } = useQuery(
    [`products`],
    async () => {
      const response = await axios.get<ProductGetRequest>(
        `${Endpoints.BUSINESS_LOGIC}product`,
        {
          params: {
            limit: 10,
            offset: offset,
            search: search,
            category: category,
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

export default useProducts;
