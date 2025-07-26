import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { GenericPostRequest } from "../types/";

function useCreateOrder() {
  const { accessToken } = useAuth();

  return useMutation(
    ["create-order"],
    async (): Promise<GenericPostRequest<unknown>> => {
      const response = axios.post<
        {},
        AxiosResponse<GenericPostRequest<unknown>>
      >(
        `${Endpoints.BUSINESS_LOGIC}orders/create/`,
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

export default useCreateOrder;
