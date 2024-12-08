import { useQuery } from "@tanstack/react-query";
import instance from "..";

interface GetUserParams {
	page: number;
}

export const useGetUsers = (params?: GetUserParams) => {
	return useQuery({
		queryKey: ["get-list-users", params],
		queryFn: () =>
			instance.get("/users", {
				params,
			}),
	});
};
