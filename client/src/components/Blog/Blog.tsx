import { useState, useEffect, JSX } from "react";
import { getPosts, PostListItem } from "../../api/posts.ts";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const Blog = (): JSX.Element => {
  const [posts, setPosts] = useState<PostListItem[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  return (
    <Grid container>
      {posts.map((post: PostListItem) => {
        return (
          <Grid key={post.slug}>
            <Card>
              <CardContent>
                <Typography variant="h5">{post.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Blog;
