import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardPath } from "../dashboard/Dashboard.js";
import { saveUserSession } from "./loginHelper.js";
import { trpc } from "../../utils/trpc.js";

const loginPath = "/login";

const LoginRoute = function () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, isLoading, isError, error } =
    trpc.authentication.login.useMutation({
      onSuccess(data, variables) {
        saveUserSession(data, variables.username);
        navigate(dashboardPath, { replace: true });
      },
    });
  const navigate = useNavigate();

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    mutateAsync({ username, password });
  };

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
