import axios, {AxiosResponse} from "axios";
import { useMutation } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { TokenPostRequest } from "../types/";

function useLogIn() {
  return useMutation(
    ["login"],
    async (data: {
      cpf: string;
      password: string;
    }): Promise<TokenPostRequest> => {
      const response = axios.post<
        { cpf: string; password: string },
        AxiosResponse<TokenPostRequest>
      >(`${Endpoints.AUTH_SERVER}user/token/`, data);
      return (await response).data;
    }
  );
}

export default useLogIn;
