import axios, { AxiosInstance, AxiosResponse } from "axios";

interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Post extends PostListItem {
  markdownContent: string;
}

interface ApiSuccessBaseResponse {
  success: true;
}

interface ApiGetPostsSuccessResponse extends ApiSuccessBaseResponse {
  data: PostListItem[];
}

interface ApiGetPostSuccessResponse extends ApiSuccessBaseResponse {
  data: Post;
}

interface ApiCreatePostSuccessResponse extends ApiSuccessBaseResponse {
  data: Post;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getPosts = async (): Promise<PostListItem[]> => {
  const response: AxiosResponse<ApiGetPostsSuccessResponse> =
    await apiClient.get("/posts");

  const posts = response.data.data;

  return posts;
};

const getPost = async (slug: string): Promise<Post> => {
  const response: AxiosResponse<ApiGetPostSuccessResponse> =
    await apiClient.get(`/posts/${slug}`);

  const post = response.data.data;

  return post;
};

const createPost = async (
  title: string,
  markdownContent: string
): Promise<Post> => {
  const postData = { title, markdownContent };

  const response: AxiosResponse<ApiCreatePostSuccessResponse> =
    await apiClient.post("/posts", postData); // 使用 apiClient.post 发送 POST 请求

  return response.data.data;
};

const createPostWithImages = async (file: File) => {
  const formData = new FormData();
  formData.append("blogPackage", file);

  const response: AxiosResponse<ApiCreatePostSuccessResponse> =
    await apiClient.post("/posts/zip", formData, {
      headers: {
        // 浏览器会自动设置正确的 multipart/form-data 类型和 boundary
        // 但为了明确，我们在这里可以覆盖默认的 'application/json'
        "Content-Type": "multipart/form-data",
      },
    });

  return response.data.data;
};

export {
  getPosts,
  getPost,
  createPost,
  createPostWithImages,
  PostListItem,
  Post,
};
