import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardPath } from "../dashboard/Dashboard.js";
import { saveUserSession } from "./loginHelper.js";
import { trpc } from "../../utils/trpc.js";
import { ArwesButton } from "../common/ArwesButton.js";
import { ArwesCard } from "../common/ArwesCard.js";
import { ArwesInput } from "../common/ArwesInput.js";

const loginPath = "/login";

const LoginRoute = function () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isError, error, mutate } = trpc.authentication.login.useMutation({
    onSuccess(data, variables) {
      saveUserSession(data, variables.username);
      navigate(dashboardPath, { replace: true });
    },
  });
  const navigate = useNavigate();

  const handleSubmit = function (event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({ username, password });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <ArwesCard title="Login" className="login-card">
        <form onSubmit={(e) => handleSubmit(e)} style={{ width: "300px" }}>
          <label
            htmlFor="username"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Username:
          </label>
          <ArwesInput
            type="text"
            name="username"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            id="username"
          />
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Password:
          </label>
          <ArwesInput
            type="password"
            name="password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            id="password"
          />

          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <ArwesButton type="submit">Submit</ArwesButton>
          </div>
          {isError && error instanceof Error && (
            <p
              style={{
                color: "var(--arwes-palette-error-main)",
                marginTop: "10px",
              }}
            >
              Error: {error.message}
            </p>
          )}
        </form>
      </ArwesCard>
    </div>
  );
};

export { loginPath };
export default LoginRoute;
