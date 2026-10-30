import type { Font } from "./font";

export type PostsResponse = {
  items: Post[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  recommend_reason: string | null;
  post_type: string;
  created_at: string;
  updated_at: string;
  user: PostUser;
  comment_count: number;
  font: Font;
};

export type PostUser = {
  id: number | null;
  nickname: string;
  role: string;
};
