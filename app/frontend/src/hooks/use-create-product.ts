import axios, { AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { GenericPostRequest } from "../types";

interface ProductPayload {
  title: string;
  category: string | null;
  festivity: string | null;
  stock_quant: number;
  price: number;
  description: string | null;
  file_img?: File | null; // <- novo campo
}

function useCreateProduct(onSuccess?: () => void) {
  const { accessToken } = useAuth();

  return useMutation(
    ["create-product"],
    async (productData: ProductPayload): Promise<GenericPostRequest<unknown>> => {
      const formData = new FormData();

      formData.append("title", productData.title);
      formData.append("price", String(productData.price));
      formData.append("stock_quant", String(productData.stock_quant));
      if (productData.category) formData.append("category", productData.category);
      if (productData.festivity) formData.append("festivity", productData.festivity);
      if (productData.description) formData.append("description", productData.description);
      if (productData.file_img) formData.append("file_img", productData.file_img);

      const response = await axios.post<
        {},
        AxiosResponse<GenericPostRequest<unknown>>
      >(`${Endpoints.BUSINESS_LOGIC}product/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    },
    {
      onSuccess,
    }
  );
}

export default useCreateProduct;
