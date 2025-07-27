import axios from "axios";
import { useMutation } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";

function useGetPortfolio() {
  const { accessToken } = useAuth();

  return useMutation(
    async (fileName: string): Promise<Blob> => {
      const response = await axios.get(
        `${Endpoints.BUSINESS_LOGIC}products/pdf/download/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "blob", // necessário para arquivos binários
        }
      );
      return response.data;
    }
  );
}

export default useGetPortfolio;
