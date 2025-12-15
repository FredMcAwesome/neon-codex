import { Link } from "react-router-dom";
import { trpc } from "../../utils/trpc.js";
import { ArwesCard } from "../common/ArwesCard.js";

const forumPath = "/forum/";
const Forum = function () {
  const { data, error, isError, isPending } =
    trpc.forum.getThreadList.useQuery();

  if (isPending) {
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
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Forum Threads</h2>
      <div style={{ display: "grid", gap: "20px" }}>
        {data.map((thread) => {
          return (
            <Link
              to={forumPath + thread.id}
              key={thread.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ArwesCard title={thread.title}>
                <div>
                  <span style={{ opacity: 0.7 }}>Created By: </span>
                  {thread.user}
                </div>
              </ArwesCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export { forumPath };
export default Forum;
