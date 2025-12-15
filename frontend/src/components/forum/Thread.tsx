import { useParams } from "react-router-dom";
import { trpc } from "../../utils/trpc.js";
import { ArwesCard } from "../common/ArwesCard.js";
const threadPath = "/forum/:id";
const Thread = function () {
  const { id } = useParams();
  const { data, error, isError, isPending } = trpc.forum.getThread.useQuery(
    id === undefined ? "" : id
  );
  if (isPending) {
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
    <div style={{ padding: "20px" }}>
      <ArwesCard title={data.title} className="thread-card">
        <div style={{ marginBottom: "20px", opacity: 0.8 }}>
          Submitted by: {data.username}
        </div>
        <div style={{ display: "grid", gap: "10px" }}>
          {data.comments.map((comment, index) => {
            return (
              <ArwesCard
                key={index}
                palette="secondary"
                title={`Comment by ${comment.username}`}
              >
                <div>{comment.content}</div>
              </ArwesCard>
            );
          })}
        </div>
      </ArwesCard>
    </div>
  );
};

export { threadPath };
export default Thread;
