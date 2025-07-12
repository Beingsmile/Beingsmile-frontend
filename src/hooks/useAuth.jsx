import { useMutation } from "@tanstack/react-query";
import { createUser, loginUser } from "../api/authAPI";

export const useRegister = () => {
  return useMutation({
    mutationFn: createUser,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};