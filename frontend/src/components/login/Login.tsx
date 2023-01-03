import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardPath } from "../dashboard/Dashboard.js";
import { attemptLogin } from "./loginHelper.js";

const loginPath = "/login";

const LoginRoute = function () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, isLoading, data, isError, error } =
    useMutation(attemptLogin);
  const navigate = useNavigate();

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    try {
      await mutateAsync({ username, password });
    } catch (err) {
      //catch pointless error
    }
  };

  useEffect(() => {
    if (data?.success) {
      console.log("logged in");
      navigate(dashboardPath, { replace: true });
    }
  }, [data]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          id="username"
        />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          id="password"
        />

        <input
          disabled={isLoading}
          name="submit"
          type="submit"
          value="Submit"
        />
        {isError && error instanceof Error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export { loginPath };
export default LoginRoute;
