import { useMutation } from "@tanstack/react-query";
import createUser from "../api/authAPI";

export const useRegister = () => {
  return useMutation({
    mutationFn: createUser,
  });
};
