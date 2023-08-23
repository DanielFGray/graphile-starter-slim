import { Card } from "~/components";
import { type PostFieldsFragment } from "~/generated";
import ago from "s-ago";

export function Post(post: PostFieldsFragment) {
  const createdAt = new Date(post.createdAt);
  return (
    <Card>
      <h2 className="text-3xl font-bold">{post.title}</h2>
      {!post.body ? null : (
        <div className="prose dark:prose-invert max-h-[80vh] overflow-auto">
          {post.body.split("\n\n+").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      <ul className="flex flex-row flex-wrap items-baseline gap-2">
        <span className="bg-primary-700 dark:bg-primary-600 p-1 text-primary-100">
          by {post.user?.username}
        </span>
        {post.tags.map(t => (
          <li key={t} className="bg-primary-700 p-1 text-primary-100 dark:bg-primary-600">
            #{t}
          </li>
        ))}
        <time dateTime={createdAt.toLocaleString()}>{ago(createdAt)}</time>
      </ul>
    </Card>
  );
}