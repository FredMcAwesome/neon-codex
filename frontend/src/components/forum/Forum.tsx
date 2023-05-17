const forumPath = "/forum";
import { trpc } from "../../utils/trpc.js";

const Forum = function () {
  const { data, error, isError, isLoading } = trpc.forum.getThreads.useQuery();

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

export { forumPath };
export default Forum;
