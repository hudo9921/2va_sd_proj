import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { Endpoints } from "../constants/Endpoints/endpoints";
import { useAuth } from "../context";
import { User } from "../types/";

function useUserInfo() {
  const { accessToken } = useAuth();

  return useMutation(["user-info"], async (): Promise<User> => {
    const response = axios.get<{}, AxiosResponse<User>>(
      `${Endpoints.AUTH_SERVER}user/info`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return (await response).data;
  });
}

export default useUserInfo;
