import { useParams } from "react-router-dom";
import { FormErrors, Layout, Spinner, clsx } from "../components";
import { type PostFieldsFragment, usePostByIdQuery } from "../generated";
import ago from "s-ago";

export function PostCard(post: PostFieldsFragment) {
  const createdDate = new Date(post.createdAt);
  return (
    <div
      className={clsx(
        "bg-primary-50 p-4 transition-opacity duration-150",
        post.id === "optimistic" && "opacity-50",
      )}
    >
      <h2 className="text-3xl font-bold dark:text-primary-900">{post.title}</h2>
      {!post.body ? null : (
        <div className="prose max-h-[80vh] overflow-auto">
          {post.body.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      <ul className="flex flex-row flex-wrap items-baseline gap-4">
        <Tag>by {post.user?.username}</Tag>
        {post.tags?.map(p => <Tag key={p} children={p} />)}
        <Tag>{ago(createdDate)}</Tag>
      </ul>
    </div>
  );
}

function Tag({ children }) {
  return <li className="bg-primary-600 p-1 text-primary-100">{children}</li>;
}

export default function Post() {
  const { id } = useParams();
  const query = usePostByIdQuery({ variables: { id } });
  return (
    <Layout query={query}>
      <div className="px-4">
        {query.error ? (
          <div className="bg-red-300 p-4 text-xl font-medium">
            <FormErrors errors={query.error.message} />
          </div>
        ) : !query.data ? (
          <Spinner />
        ) : !query.data?.post ? (
          <div className="bg-red-300 p-4 text-xl font-medium">
            <FormErrors errors="post not found" />
          </div>
        ) : (
          <PostCard {...query.data?.post} />
        )}
      </div>
    </Layout>
  );
}
