import axios, { AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";

interface UserPayload {
  cpf: string;
  email: string;
  password: string;
  full_name: string;
  // adicione outros campos necessários, ex: firstName?, lastName?, etc
}

interface GenericPostRequest<T> {
  success: boolean;
  data: T;
  message?: string;
}

function useCreateUser(onSuccess?: () => void) {
  return useMutation(
    ["create-user"],
    async (userData: UserPayload): Promise<GenericPostRequest<unknown>> => {
      const response = await axios.post<{}, AxiosResponse<GenericPostRequest<unknown>>>(
        `${Endpoints.AUTH_SERVER}user/create/`,
        userData
      );
      return response.data;
    },
    {
      onSuccess,
    }
  );
}

export default useCreateUser;
