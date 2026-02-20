import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { createUser, loginUser } from "../api/authAPI";
import { AuthContext } from "../contexts/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

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