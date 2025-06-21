import { useState, useEffect, JSX } from "react";
import { getPosts, PostListItem } from "@api/posts.ts";
import { Grid, Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

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
    <Grid container direction="column" spacing={2}>
      {posts.map((post: PostListItem) => {
        return (
          <Grid key={post.slug}>
            <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card>
                <CardActionArea sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h5">{post.title}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Blog;
