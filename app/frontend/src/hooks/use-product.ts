import axios from "axios";
import { useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { Product } from "../types/";

function useProduct(id?: string) {
  const {
    data: product,
    isLoading,
    isFetching,
    refetch
  } = useQuery(
    [`product`, id],
    async () => {
      const response = await axios.get<Product>(
        `${Endpoints.BUSINESS_LOGIC}product/${id}`
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      enabled: !!id
    }
  );

  return { product, isLoading, isFetching, refetch };
}

export default useProduct;
