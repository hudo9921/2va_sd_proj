import axios from "axios";
import { useMutation } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";

function useGeneratePortfolio(onSuccess?: (fileUrl: string) => void) {
  const { accessToken } = useAuth();

  return useMutation(
    ["generate-portfolio"],
    async (query: {
      category: string | null;
      festivity: string | null;
    }): Promise<{ file_name: string }> => {
      const response = await axios.post(
        `${Endpoints.BUSINESS_LOGIC}products/pdf/generate/`,
        {},
        {
          params: {
            category: query.category,
            festivity: query.festivity
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data.file_name);
      },
    }
  );
}

export default useGeneratePortfolio;
