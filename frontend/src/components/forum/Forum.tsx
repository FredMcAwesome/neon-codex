import type { ThreadListType } from "@shadowrun/common/src/index.js";
import { ThreadListSchema } from "@shadowrun/common/src/index.js";
import { useQuery } from "@tanstack/react-query";
import { SERVER } from "../../utils/config.js";

async function fetchThreads() {
  console.log("fetch Threads");
  const response: Response = await fetch(SERVER + "/api/forum/thread", {
    mode: "cors",
  });
  // https://tanstack.com/query/v4/docs/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const resJson: unknown | ThreadListType = await response.json();
  const parsedRes = ThreadListSchema.safeParse(resJson);
  if (parsedRes.success) {
    return parsedRes.data;
  } else {
    throw new Error(parsedRes.error.issues.toString());
  }
}

const Forum = function () {
  const { data, error, isError, isLoading } = useQuery(
    ["threads"],
    fetchThreads
  );

  if (isLoading) {
    return <div>Loading threads...</div>;
  }

  if (isError) {
    // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field
    if (error instanceof Error) {
      return <div>Error! {error.message}</div>;
    } else {
      return <div>Error!</div>;
    }
  }

  return (
    <table>
      <tbody>
        {data.map((thread) => {
          return (
            <tr key={thread.id}>
              <td>Thread: {thread.title}</td>
              <td>Created By: {thread.user}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Forum;
