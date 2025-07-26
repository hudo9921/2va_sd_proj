import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { Product } from "../types/";

function useProductMutation() {

  return useMutation(["product-mut"], async (productId: number): Promise<Product> => {
    const response = axios.get<{}, AxiosResponse<Product>>(
      `${Endpoints.BUSINESS_LOGIC}product/${productId}`,
    );
    return (await response).data;
  });
}

export default useProductMutation;
