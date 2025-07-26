import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { GenericPostRequest } from "../types/";

function useClearCart() {
  const { accessToken } = useAuth();

  return useMutation(
    ["clear-cart"],
    async (): Promise<GenericPostRequest<unknown>> => {
      const response = axios.post<
        {},
        AxiosResponse<GenericPostRequest<unknown>>
      >(
        `${Endpoints.BUSINESS_LOGIC}cart/clear`,
        {},
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

export default useClearCart;
