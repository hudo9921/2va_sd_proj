import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { CartItem } from "../types/";

function useEditCartItem() {
  const { accessToken } = useAuth();

  return useMutation(
    ["cart-item-edit"],
    async (
      data: {
        productId: number,
        quantity: number;
      }
    ): Promise<CartItem> => {
      const response = axios.put<{}, AxiosResponse<CartItem>>(
        `${Endpoints.BUSINESS_LOGIC}cart/${data.productId}`,
        data,
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

export default useEditCartItem;
