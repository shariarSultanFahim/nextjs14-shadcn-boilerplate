import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const update = ({ id, data }: { id: number | string; data: unknown }) => {
  return instance.patch(`/users/${id}`, { ...data });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-list-courses", "get-course-by-id"],
      });
    },
  });
};
