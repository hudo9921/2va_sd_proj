import axios from "axios";
import { useMutation } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";

function useDeleteProduct(onSuccess?: () => void) {
  const { accessToken } = useAuth();

  return useMutation(
    ["delete-product"],
    async (productId: number): Promise<void> => {
      await axios.delete(`${Endpoints.BUSINESS_LOGIC}product/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    {
      onSuccess,
    }
  );
}

export default useDeleteProduct;
