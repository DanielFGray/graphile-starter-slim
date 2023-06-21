import { type PostFieldsFragment } from "../generated";

export function Post(post: PostFieldsFragment) {
  if (!post) return null;
  return (
    <div className="p-8 bg-primary-50">
      <h2 className="text-3xl font-bold">{post.title}</h2>
      {!post.body ? null : (
        <div className="prose max-h-[80vh] overflow-auto">
          {post.body.split("\n\n").map(p => (
            <p>{p.split('\n').reduce((p, c) => p.concat(c, <br/>), [])}</p>
          ))}
        </div>
      )}
      <ul className="flex flex-row gap-2 items-baseline">
        <span className="text-primary-100 bg-primary-700 p-1">by {post.user?.username}</span>
        {post.tags.map(p => (
          <li className="text-primary-100 bg-primary-700 p-1">#{p}</li>
        ))}
        <span className="bg-gray-50">{post.createdAt}</span>
      </ul>
    </div>
  );
}
