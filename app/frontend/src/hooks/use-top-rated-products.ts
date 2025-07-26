import axios from 'axios';
import { useQuery } from 'react-query';
import { Endpoints } from "../constants/Endpoints/endpoints";
import { ProductGetRequest } from "../types/"

function useTopRatedProducts() {
  // const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc5MDAwNjczLCJpYXQiOjE2Nzg5OTg4NzMsImp0aSI6IjRhNmZjNTM3MGY1MTRiZWZiNTU0NzhmYTY5NzFmMTU4IiwidXNlcl9pZCI6IjcwNjA1ODgzNDU5In0.cUFpNsdF4W7grA8Py0t8-Do1KHxF_o-34kplFGorfPI';
  const { data: products, isLoading, isFetching } = useQuery(
    [`top-rated-products`],
    async () => {
      // const response = await axios.get<Product>(`${Endpoints.BUSINESS_LOGIC}product/`, {
      //   headers: {
      //     Authorization: token,
      //   },
      // });
      const response = await axios.get<ProductGetRequest>(`${Endpoints.BUSINESS_LOGIC}product/top_rated_products`);
      return response.data
    },
    {
      staleTime: Infinity,
    }
  );

  return { products, isLoading, isFetching };
}

export default useTopRatedProducts;