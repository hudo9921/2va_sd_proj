import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { CartItem, Product } from "../types/";

interface ProductPayload {
  productId: number;
  title: string;
  category: string | null;
  festivity: string | null;
  stock_quant: number;
  price: number;
  description: string | null;
  file_img?: File | null; // novo campo opcional
}

function useEditProduct(onSuccess?: () => void) {
  const { accessToken } = useAuth();

  return useMutation(
    ["edit-product"],
    async (data: ProductPayload): Promise<Product> => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("price", data.price.toString());
      formData.append("stock_quant", data.stock_quant.toString());
      if (data.category) formData.append("category", data.category);
      if (data.festivity) formData.append("festivity", data.festivity);
      if (data.description) formData.append("description", data.description);
      if (data.file_img) formData.append("file_img", data.file_img);

      const response = await axios.put<Product>(
        `${Endpoints.BUSINESS_LOGIC}product/${data.productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // 'Content-Type' NÃO precisa ser definido aqui para FormData
          },
        }
      );

      return response.data;
    },
    {
      onSuccess,
    }
  );
}


export default useEditProduct;
