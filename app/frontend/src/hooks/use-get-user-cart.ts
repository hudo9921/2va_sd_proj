import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { UserCartGetRequest } from "../types/";

function useGetUserCart() {
  const { accessToken } = useAuth();

  return useMutation(["get-user-cart"], async (): Promise<UserCartGetRequest> => {
    const response = axios.get<{}, AxiosResponse<UserCartGetRequest>>(
      `${Endpoints.BUSINESS_LOGIC}cart/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return (await response).data;
  });
}

export default useGetUserCart;
