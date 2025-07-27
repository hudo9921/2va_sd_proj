import axios from 'axios';
import { useQuery } from 'react-query';
import { Endpoints } from "../constants/Endpoints/endpoints";

function useProductsFestivities() {
  const { data: festivities, isLoading, isFetching } = useQuery(
    [`festivities`],
    async () => {
      const response = await axios.get<string[]>(`${Endpoints.BUSINESS_LOGIC}product/festivities`);
      return response.data
    },
    {
      staleTime: Infinity,
    }
  );

  return { festivities, isLoading, isFetching };
}

export default useProductsFestivities;