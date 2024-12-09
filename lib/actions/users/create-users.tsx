import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

export const useCreateUser = () => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      first_name: string;
      last_name: string;
      bio: string;
      dob: string;
      phone: string;
      secondary_phone: string;
      secondary_email: string;
      address: string;
      secondary_address: string;
      email: string;
      password: string;
      user_role: string;
      is_active: boolean;
    }) => instance.post("/users", { ...data }),
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["get-list-users"],
      });
    },
  });
};
