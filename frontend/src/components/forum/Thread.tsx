import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc.js";
const threadPath = "/forum/:id";
const Thread = function () {
  const { id } = useParams();
  const { data, error, isError, isLoading } = trpc.forum.getThread.useQuery(
    id || ""
  );
  if (isLoading) {
    return <div>Loading thread...</div>;
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
    <div>
      <div>Thread Title: {data.title}</div>
      <div>Submitted by: {data.username}</div>
      {data.comments.map((comment) => {
        return (
          <div>
            <div>{comment.content}</div>
            <div>Submitted by: {comment.username}</div>
          </div>
        );
      })}
    </div>
  );
};

export { threadPath };
export default Thread;
