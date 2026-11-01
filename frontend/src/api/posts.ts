import { refreshLogin } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { PostsResponse, PostWriteParams } from "../types/post";

type GetPostsParams = {
  page: number;
  pageSize: number;
  searchQuery: string;
};

class PostRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PostRequestError";
    this.status = status;
  }
}

async function parsePostErrorMessage(response: Response) {
  const fallbackMessage = "게시글 요청을 처리하지 못했습니다.";

  try {
    const errorData = await response.json();
    return errorData.detail ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

async function requestPost(path: string, options: RequestInit = {}) {
  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    try {
      await refreshLogin();
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
    } catch {
      throw new PostRequestError("로그인이 필요해요.", 401);
    }
  }

  if (!response.ok) {
    const errorMessage = await parsePostErrorMessage(response);
    throw new PostRequestError(errorMessage, response.status);
  }

  return response.json();
}

export async function getPosts({
  page,
  pageSize,
  searchQuery,
}: GetPostsParams): Promise<PostsResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (searchQuery.trim()) {
    searchParams.set("search", searchQuery.trim());
  }

  return requestPost(`/posts?${searchParams.toString()}`);
}

export async function getPost(postId: string) {
  return requestPost(`/posts/${postId}`);
}

export async function getNotices({ limit = 5 } = {}) {
  const searchParams = new URLSearchParams({
    limit: String(limit),
  });

  return requestPost(`/notices?${searchParams.toString()}`);
}

export async function createPost({
  title,
  content,
  fontId,
  postType = "post",
  recommendReason,
}: PostWriteParams) {
  return requestPost("/posts", {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
      font_id: fontId,
      post_type: postType,
      recommend_reason: recommendReason,
    }),
  });
}

export async function updatePost(
  postId: string,
  {
    title,
    content,
    fontId,
    postType = "post",
    recommendReason,
  }: PostWriteParams,
) {
  return requestPost(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      content,
      font_id: fontId,
      post_type: postType,
      recommend_reason: recommendReason,
    }),
  });
}

export async function deletePost(postId: string) {
  return requestPost(`/posts/${postId}`, {
    method: "DELETE",
  });
}
