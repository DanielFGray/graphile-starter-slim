import { Card, UserContent } from "~/components";
import { type PostFieldsFragment } from "~/generated";
import ago from "s-ago";
import { Link } from "@remix-run/react";
import { ComponentProps } from "react";

function Tag<T extends keyof React.JSX.IntrinsicElements>({
  as: As = "span",
  ...props
}: {
  as: T;
} & ComponentProps<T>) {
  return (
    <As
      {...props}
      className="rounded bg-primary-200 p-1 dark:bg-primary-600 dark:text-primary-300"
    />
  );
}

export function Post(post: PostFieldsFragment) {
  const createdAt = new Date(post.createdAt);
  return (
    <Card>
      <Link to={`/post/${post.id}`}>
        <h2 className="text-3xl font-bold">{post.title}</h2>
      </Link>
      {!post.body ? null : <UserContent text={post.body} />}
      <ul className="-mx-1 flex flex-row flex-wrap items-baseline gap-2 text-xs font-medium tracking-tight">
        <Link to={`/user/${post.user?.username}`}>
          <Tag>
            by <span className="font-bold">{post.user?.username}</span>
          </Tag>
        </Link>
        {post.tags.map(t => (
          <Tag as="li" key={t}>
            #{t}
          </Tag>
        ))}
        <Tag as="time" dateTime={createdAt.toLocaleString()}>
          {ago(createdAt)}
        </Tag>
      </ul>
    </Card>
  );
}

export function PostList({ posts }: { posts: null | undefined | PostFieldsFragment[] }) {
  return (
    <div className="flex-row flex-wrap gap-4 space-y-4 p-4 md:flex md:space-y-0">
      {posts?.map(post => <Post key={post.id} {...post} />)}
    </div>
  );
}
