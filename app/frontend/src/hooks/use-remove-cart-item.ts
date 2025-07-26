import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { GenericPostRequest } from "../types/";

function useRemoveCartItem() {
  const { accessToken } = useAuth();

  return useMutation(
    ["remove-cart-item"],
    async (cartItemId: number): Promise<GenericPostRequest<unknown>> => {
      const response = axios.delete<
        {},
        AxiosResponse<GenericPostRequest<unknown>>
      >(
        `${Endpoints.BUSINESS_LOGIC}cart/remove/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return (await response).data;
    }
  );
}

export default useRemoveCartItem;
