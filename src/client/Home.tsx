import { useState } from "react";
import {
  Layout,
  Button,
  Container,
  Fieldset,
  Form,
  Input,
  FormErrors,
  Stringify,
  Legend,
} from "../components";
import { useLatestPostsQuery, useCreatePostMutation, useSharedLayoutQuery, LatestPostsQuery } from "../generated";
import { useNavigate } from "react-router-dom";
import { getCodeFromError, getExceptionFromError } from "../lib";
import { Post } from "./post";

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
          className="w-1/2 mx-auto"
          onSubmit={async ({ values, setErrors }) => {
            try {
              const newPost = await createPost(
                { variables: { ...values, tags: ["test"] } },
                {
                  optimisticResponse: {
                    createPost: {
                      __typename: "CreatePostPayload",
                      post: {
                        id: "optimistic",
                        ...values,
                        __typename: "Post",
                        createdAt: new Date().toUTCString(),
                      },
                    },
                  },
                },
              );
              console.log(newPost);
              setShowForm(false);
              const post = newPost.data?.createPost.post
              // navigate(`/posts/${post.postId}`);
            } catch (e) {
              const code = getCodeFromError(e);
              switch (code) {
                case "25P02":
                  setErrors("body must not be empty");
                  break;
                default:
                  throw e;
              }
            }
          }}
        >
          <Fieldset>
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
          </Fieldset>
        </Form>
      ) : query.data?.currentUser ? (
        <div className="text-center">
          <Button variant="primary" className="text-2xl font-bold px-4" onClick={() => setShowForm(true)}>
            create post
          </Button>
        </div>
      ) : null}
      <div className="flex flex-row flex-wrap gap-4 m-4 shrink-0">
        {(query.data as LatestPostsQuery)?.posts?.nodes.map(post => (
          <Post key={post.postId} {...post} />
        ))}
      </div>
    </Layout>
  );
}
