import { useState } from "react";
import { Layout, Button, Container, Card, Form, Input, FormErrors, Legend } from "../components";
import {
  useLatestPostsQuery,
  useCreatePostMutation,
  LatestPostsQuery,
  LatestPostsDocument,
  PostFieldsFragment,
} from "../generated";
import { Link, useNavigate } from "react-router-dom";
import { getCodeFromError, getExceptionFromError } from "../lib";
import { PostCard } from "./post";

export default function Home() {
  const query = useLatestPostsQuery();
  const [createPost] = useCreatePostMutation();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  return (
    <Layout query={query}>
      {query.data?.currentUser && showForm ? (
        <Form
          onReset={() => setShowForm(false)}
          className="mx-auto max-w-2xl"
          onSubmit={async ({ values, setErrors }) => {
            const variables = { ...values, tags: ["test"] } as {
              title: string;
              body: string;
              tags: Array<string>;
            };
            console.log({ variables });
            const optimisticDate = new Date().toUTCString();
            try {
              const newPost = await createPost({
                variables,
                update: (proxy, response) => {
                  const cache = proxy.readQuery<LatestPostsQuery>({ query: LatestPostsDocument });
                  const data = {
                    currentUser: query.data?.currentUser,
                    posts: {
                      nodes: [response.data?.createPost?.post].concat(cache?.posts?.nodes || []),
                    },
                  };
                  console.log({ cache, data });
                  proxy.writeQuery({ query: LatestPostsDocument, data });
                },
                optimisticResponse: {
                  createPost: {
                    __typename: "Mutation",
                    post: {
                      __typename: "Post",
                      id: "optimistic",
                      ...variables,
                      user: query.data?.currentUser,
                      score: 0,
                      popularity: 0,
                      comments: { totalCount: 0 },
                      updatedAt: optimisticDate,
                      createdAt: optimisticDate,
                    },
                  },
                },
              });
              console.log(newPost);
              setShowForm(false);
              navigate(`/p/${newPost.data?.createPost?.post?.id}`);
            } catch (e) {
              const code = getCodeFromError(e);
              switch (code) {
                case "25P02": {
                  setErrors("body must not be empty");
                  break;
                }
                default: {
                  console.log(e);
                  throw e;
                }
              }
            }
          }}
        >
          <Card as="fieldset">
            <Legend>new post</Legend>
            <Container>
              <Input placeholder="title" type="text" name="title" />
              <Input placeholder="body" type="textarea" name="body" />
              <div className="flex flex-row gap-4 [&>*]:grow">
                <Button variant="primary" type="submit">
                  send
                </Button>
                <Button type="reset">cancel</Button>
              </div>
            </Container>
            <FormErrors />
          </Card>
        </Form>
      ) : query.data?.currentUser ? (
        <div className="text-center">
          <Button
            variant="primary"
            className="px-4 text-2xl font-bold"
            onClick={() => setShowForm(true)}
          >
            create post
          </Button>
        </div>
      ) : null}
      <div className="m-4 flex shrink-0 flex-row flex-wrap gap-4">
        {query.data?.posts?.nodes.map(post => (
          <Link to={`/p/${post.id}`} key={post.id}>
            <PostCard {...post} />
          </Link>
        ))}
      </div>
    </Layout>
  );
}
