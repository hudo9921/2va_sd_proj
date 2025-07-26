import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { GenericPostRequest, ProductGetRequest } from "../types/";

function useAddProductToCart(productId: number, quantity: number) {
  const { accessToken } = useAuth();

  return useMutation(["add-to-cart"], async (data: {
    quantity: number
  }): Promise<GenericPostRequest<unknown>> => {
    const response = axios.post<{quantity: string}, AxiosResponse<GenericPostRequest<unknown>>>(
      `${Endpoints.BUSINESS_LOGIC}cart/add-to-cart/${productId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return (await response).data;
  });
}

export default useAddProductToCart;
