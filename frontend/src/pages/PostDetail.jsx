import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createComment,
  deleteComment,
  getComments,
} from "../api/comments";
import { deletePost, getPost } from "../api/posts";
import {
  ArrowUpIcon,
  ChatBubbleLeftEllipsisIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "../components/icons";
import FloatingActionStack from "../components/FloatingActionStack";
import FontRecommendationHeader from "../components/FontRecommendationHeader";
import PreservedText from "../components/PreservedText";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import IconButton from "../components/ui/IconButton";
import StateMessage from "../components/ui/StateMessage";
import StateSection from "../components/ui/StateSection";
import TextActionButton from "../components/ui/TextActionButton";
import Textarea from "../components/ui/Textarea";
import useScrollThreshold from "../hooks/useScrollThreshold";
import { createWebFontStyle } from "../utils/webFont";

const fallbackFontReason =
  "이 글에 어울리는 폰트 정보를 확인하고 있어요. 추천 이유는 AI 연결 후 더 자세히 보여줄 예정이에요.";

function formatPostDate(createdAt) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "",
      dateTime: "",
      time: "",
    };
  }

  return {
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date),
    dateTime: date.toISOString(),
    time: new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date),
  };
}

function formatCommentDate(createdAt) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "",
      dateTime: "",
      time: "",
    };
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return {
    date: `${year}.${month}.${day}`,
    dateTime: date.toISOString(),
    time: `${hour}:${minute}`,
  };
}

function transformPostDetail(post) {
  const formattedDate = formatPostDate(post.created_at);
  const fontName = post.font?.name ?? "Unknown";
  const isPaid = post.font?.is_paid ?? post.font?.isPaid;

  return {
    author: post.user?.nickname ?? post.nickname ?? "작성자",
    authorId: post.user?.id,
    content: post.content,
    date: formattedDate.date,
    dateTime: formattedDate.dateTime,
    font: {
      downloadUrl: post.font?.download_url ?? post.font?.downloadUrl ?? "#",
      isPaid,
      license: post.font?.license ?? "",
      licenseSummary: post.font?.license_summary ?? post.font?.licenseSummary ?? [],
      name: fontName,
      notice:
        post.font?.notice ?? "브랜드 적용 전 라이선스 원문을 한 번 더 확인하세요.",
      reason:
        post.recommend_reason ??
        post.font?.reason ??
        post.reason ??
        fallbackFontReason,
      source: post.font?.source ?? "",
      tags: post.font?.tags ?? [],
      usage: post.font?.usage ?? "",
    },
    time: formattedDate.time,
    title: post.title,
    contentFontStyle: createWebFontStyle(post.font),
  };
}

function transformComment(comment) {
  const formattedDate = formatCommentDate(comment.created_at);

  return {
    content: comment.content,
    date: formattedDate.date,
    dateTime: formattedDate.dateTime,
    id: comment.id,
    nickname: comment.nickname,
    time: formattedDate.time,
    userId: comment.user_id,
  };
}

function PostDetail({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postDetail, setPostDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postErrorMessage, setPostErrorMessage] = useState("");
  const [commentErrorMessage, setCommentErrorMessage] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const shouldShowScrollTopButton = useScrollThreshold();
  const boardPath = location.state?.boardPath ?? "/";
  const detailPath = [location.pathname, location.search, location.hash].join("");

  const handleCommentContentChange = (event) => {
    setCommentContent(event.target.value);
    setCommentErrorMessage("");
  };

  const handleCreateComment = async () => {
    const trimmedContent = commentContent.trim();

    if (!user) {
      setCommentErrorMessage("로그인 후 댓글을 등록해주세요.");
      return;
    }

    if (!trimmedContent) {
      setCommentErrorMessage("댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmittingComment(true);
    setCommentErrorMessage("");

    try {
      const commentResponse = await createComment(postId, {
        content: commentContent,
      });
      setComments((currentComments) => [
        ...currentComments,
        transformComment(commentResponse),
      ]);
      setCommentContent("");
    } catch (error) {
      setCommentErrorMessage(error.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleRequestDeleteComment = (commentId) => {
    setDeletingCommentId(commentId);
  };

  const handleDeleteComment = async () => {
    if (!deletingCommentId) {
      return;
    }

    setIsDeletingComment(true);

    try {
      await deleteComment(deletingCommentId);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== deletingCommentId),
      );
      setDeletingCommentId(null);
    } catch (error) {
      setCommentErrorMessage(error.message);
    } finally {
      setIsDeletingComment(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeletingPost(true);

    try {
      await deletePost(postId);
      setIsDeleteDialogOpen(false);
      navigate(boardPath);
    } catch (error) {
      setPostErrorMessage(error.message);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleWriteClick = () => {
    if (user) {
      navigate("/write", { state: { boardPath } });
      return;
    }

    navigate("/login");
  };

  const handleScrollTopClick = () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([getPost(postId), getComments(postId)])
      .then(([postResponse, commentResponse]) => {
        if (!isMounted) {
          return;
        }

        setPostDetail(transformPostDetail(postResponse));
        setComments(commentResponse.map((comment) => transformComment(comment)));
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setPostErrorMessage(error.message);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsLoadingPost(false);
      });

    return () => {
      isMounted = false;
    };
  }, [postId]);

  if (isLoadingPost) {
    return (
      <main className="p-6">
        <StateSection minHeight="lg">게시글을 불러오는 중이에요.</StateSection>
      </main>
    );
  }

  if (postErrorMessage || !postDetail) {
    return (
      <main className="p-6">
        <StateSection minHeight="lg" tone="error">
          {postErrorMessage || "게시글을 찾을 수 없습니다."}
        </StateSection>
      </main>
    );
  }

  return (
    <main className="p-6">
      <section className="mx-auto w-full max-w-[720px] pt-8 pb-12">
        <Button
          as={Link}
          className="mb-16 inline-flex no-underline"
          size="inline"
          to={boardPath}
          variant="text"
        >
          목록으로
        </Button>

        <FontRecommendationHeader
          font={postDetail.font}
          reason={postDetail.font.reason}
        />

        <article className="mt-20">
          <time className="text-xs text-[#d4d4d4]" dateTime={postDetail.dateTime}>
            {postDetail.date} · {postDetail.time}
          </time>
          <h1 className="mt-4 text-xl font-bold leading-tight text-black">
            {postDetail.title}
          </h1>
          <PreservedText
            className="mt-7 text-[24px] leading-relaxed text-black"
            style={postDetail.contentFontStyle}
            text={postDetail.content}
          />

          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm font-semibold leading-5 text-black">
              {postDetail.author}
            </p>
            {user?.id === postDetail.authorId ? (
              <div className="flex items-center gap-4">
                <TextActionButton
                  onClick={() =>
                    navigate(`/posts/${postId}/edit`, {
                      state: {
                        boardPath,
                        detailPath,
                      },
                    })
                  }
                >
                  수정
                </TextActionButton>
                <TextActionButton
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  삭제
                </TextActionButton>
              </div>
            ) : null}
          </div>
        </article>

        <section className="mt-5 border-t border-black pt-4">
          <div className="flex items-center gap-2 leading-none">
            <ChatBubbleLeftEllipsisIcon className="h-4 w-4 translate-y-px text-black" />
            <h2 className="text-sm font-semibold text-black">comment</h2>
            <span className="text-sm text-black">{comments.length}</span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Textarea
              className="flex-1"
              onChange={handleCommentContentChange}
              placeholder="댓글을 입력하세요."
              size="comment"
              value={commentContent}
            />
            <Button
              disabled={isSubmittingComment}
              onClick={handleCreateComment}
              size="xs"
              variant="text"
            >
              {isSubmittingComment ? "등록 중" : "등록"}
            </Button>
          </div>

          <p className="mt-2 min-h-5 text-left text-sm text-neutral-600">
            {commentErrorMessage}
          </p>

          {comments.length > 0 ? (
            <ul className="mt-6 space-y-5">
              {comments.map((comment) => (
                <li
                  className="grid grid-cols-[120px_minmax(0,1fr)_auto] items-start gap-4 text-xs"
                  key={comment.id}
                >
                  {/*
                    댓글 삭제 권한은 서버에서 최종 검증하고,
                    화면에서는 작성자 본인에게만 삭제 버튼을 보여준다.
                  */}
                  <p className="text-sm font-semibold leading-5 text-black">
                    {comment.nickname}
                  </p>
                  <PreservedText
                    className="min-w-0 text-sm leading-5 text-black"
                    text={comment.content}
                  />
                  <div className="flex h-5 items-center gap-3 self-start leading-none">
                    <time
                      className="whitespace-nowrap text-sm leading-5 text-[#d4d4d4]"
                      dateTime={comment.dateTime}
                    >
                      {comment.date} · {comment.time}
                    </time>
                    {user?.id === comment.userId ? (
                      <IconButton
                        ariaLabel="댓글 삭제"
                        onClick={() => handleRequestDeleteComment(comment.id)}
                        size="sm"
                        variant="muted"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </IconButton>
                    ) : (
                      <span aria-hidden="true" className="h-5 w-5" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <StateMessage className="mt-8 text-center">
              첫 댓글을 달아보세요!
            </StateMessage>
          )}
        </section>

        <p className="sr-only">현재 게시글 ID는 {postId}입니다.</p>
      </section>

      <FloatingActionStack>
        {shouldShowScrollTopButton ? (
          <IconButton
            ariaLabel="상단으로"
            onClick={handleScrollTopClick}
            size="floating"
            variant="floating"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </IconButton>
        ) : null}
        <IconButton
          ariaLabel="글쓰기"
          onClick={handleWriteClick}
          size="floating"
          variant="floating"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </IconButton>
      </FloatingActionStack>

      {isDeleteDialogOpen ? (
        <ConfirmDialog
          confirmLabel="삭제"
          isProcessing={isDeletingPost}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeletePost}
          title="게시물을 삭제할까요?"
        />
      ) : null}
      {deletingCommentId ? (
        <ConfirmDialog
          confirmLabel="삭제"
          isProcessing={isDeletingComment}
          message="삭제한 댓글은 되돌릴 수 없어요."
          onCancel={() => setDeletingCommentId(null)}
          onConfirm={handleDeleteComment}
          title="댓글을 삭제할까요?"
        />
      ) : null}
    </main>
  );
}

export default PostDetail;
