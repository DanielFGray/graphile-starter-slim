import { Card } from "~/components";
import { type PostFieldsFragment } from "~/generated";
import ago from "s-ago";

export function Post(post: PostFieldsFragment) {
  if (!post) return null;
  const createdAt = new Date(post.createdAt);
  return (
    <Card>
      <h2 className="text-3xl font-bold">{post.title}</h2>
      {!post.body ? null : (
        <div className="prose max-h-[80vh] overflow-auto">
          {post.body.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      <ul className="flex flex-row gap-2 items-baseline">
        <span className="text-primary-100 bg-primary-700 p-1">by {post.user?.username}</span>
        {post.tags.map(t => (
          <li key={t} className="text-primary-100 bg-primary-700 p-1">
            #{t}
          </li>
        ))}
        <span className="bg-gray-50">{ago(createdAt)}</span>
      </ul>
    </Card>
  );
}