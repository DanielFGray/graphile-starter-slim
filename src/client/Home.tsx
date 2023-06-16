import { Layout, Button, Container, Fieldset, Form, Input, RenderErrors } from "../components";
import { useCreatePostMutation, useLatestPostsQuery } from "../generated";

export default function Home() {
  const { data } = useLatestPostsQuery();
  const [createPost] = useCreatePostMutation();
  return (
    <Layout title="home">
      {({ currentUser }) => (
        <>
          {!currentUser ? null : (
            <Form
              className="px-4"
              onSubmit={async (ev, { values }) => {
                console.log(values)
                await createPost({ variables: values });
              }}
            >
              {({ error }) => (
                <Fieldset>
                  <legend>create post</legend>
                  <Container>
                    <div>
                      <Input type="text" name="title" />
                    </div>
                    <div>
                      <Input type="textarea" name="body" className="form-textarea" />
                    </div>
                    <div>
                      <Button type="submit">send</Button>
                    </div>
                  </Container>
                  <RenderErrors errors={error} />
                </Fieldset>
              )}
            </Form>
          )}
          <pre>{JSON.stringify({ currentUser, posts: data?.posts }, null, 2)}</pre>
        </>
      )}
    </Layout>
  );
}
