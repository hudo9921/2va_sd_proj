import axios from 'axios';
import { useQuery } from 'react-query';
import { Endpoints } from "../constants/Endpoints/endpoints";

function useProductsCategories() {
  const { data: categories, isLoading, isFetching } = useQuery(
    [`categories`],
    async () => {
      const response = await axios.get<string[]>(`${Endpoints.BUSINESS_LOGIC}product/categories`);
      return response.data
    },
    {
      staleTime: Infinity,
    }
  );

  return { categories, isLoading, isFetching };
}

export default useProductsCategories;