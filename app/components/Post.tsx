import { Card, UserContent } from "~/components";
import { type PostFieldsFragment } from "~/generated";
import ago from "s-ago";
import { Link } from "@remix-run/react";

export function Post(post: PostFieldsFragment) {
  const createdAt = new Date(post.createdAt);
  return (
    <Card>
      <Link to={`/post/${post.id}`}>
        <h2 className="text-3xl font-bold">{post.title}</h2>
      </Link>
      {!post.body ? null : (
        <UserContent text={post.body} />
      )}
      <ul className="flex flex-row flex-wrap text-xs font-medium tracking-tight -mx-1 items-baseline gap-2">
        <Link to={`/user/${post.user?.username}`}>
          <span className="bg-primary-200 dark:bg-primary-600 p-1 rounded dark:text-primary-100">
            by <span className="font-bold">{post.user?.username}</span>
          </span>
        </Link>
        {post.tags.map(t => (
          <li
            key={t}
            className="bg-primary-200 p-1 rounded dark:text-primary-100 dark:bg-primary-600"
          >
            #{t}
          </li>
        ))}
        <time
          className="bg-primary-200 p-1 rounded dark:text-primary-100 dark:bg-primary-600"
          dateTime={createdAt.toLocaleString()}
        >
          {ago(createdAt)}
        </time>
      </ul>
    </Card>
  );
}

export function PostList({ posts }: { posts: null | undefined | PostFieldsFragment[] }) {
  return (
    <div className="md:flex flex-row flex-wrap gap-4 p-4 space-y-4 md:space-y-0">
      {posts?.map(post => <Post key={post.id} {...post} />)}
    </div>
  );
}
