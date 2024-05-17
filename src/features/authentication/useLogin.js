// using react query to check the auth
// mutation func. cuz something changes on the server as user gets logged in + handling success & error states

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      // console.log(user);
      navigate("/dashboard", { replace: true }); // this doesn't works can go back to login page:)
      // queryClient.setQueriesData(["user"], user);
      queryClient.setQueryData(["user"], user.user); // caching the user so that not on every reload  -> user is fetched from the server
      toast.success("User has been successfully authenticated");
    },
    onError: () => {
      toast.error("Provided email or password is incorrect");
    },
  });

  return { login, isLoading };
}

// making these custom hooks so that these can be reusable, seperation of concerns. Why react query? -> remote state management lib
//could have done via onclick but react query -> convenient way like giving loading state etc.

// Bug -> on SetQueriesData -> accessing the index page (dashboard) without being logged in -> user = null in react queryCache (why)? -> not authenticated logic -> session not found. -> because the user stored in cache is null react query will fetch that on login and we won't be redirected to the dashboard page.
