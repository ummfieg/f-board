import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  PencilSquareIcon,
  ShareIcon,
} from "../components/icons";
import FloatingActionStack from "../components/FloatingActionStack";
import IconButton from "../components/ui/IconButton";
import PaginationButton from "../components/ui/PaginationButton";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton";
import SearchInput from "../components/ui/SearchInput";
import StateSection from "../components/ui/StateSection";
import { getPosts } from "../api/posts";
import useScrollThreshold from "../hooks/useScrollThreshold";
import useShareLink from "../hooks/useShareLink";
import { formatBoardPostDate } from "../utils/date";
import { createWebFontStyle, hasWebFontUrl } from "../utils/webFont";

const postsPerPage = 9;
const skeletonPostCount = postsPerPage;

function createBoardPostCardData(post) {
  const fontName = post.font?.name ?? "Unknown";
  const hasKnownWebFontInfo = Array.isArray(post.font?.webfonts);

  return {
    id: post.id,
    date: formatBoardPostDate(post.created_at),
    dateTime: post.created_at ?? "",
    fontName,
    title: post.title,
    nickname: post.user?.nickname ?? post.nickname ?? "작성자",
    commentCount: post.comment_count ?? post.commentCount ?? 0,
    previewText: post.content,
    previewFontStyle: createWebFontStyle(post.font),
    hasWebFont: hasWebFontUrl(post.font),
    hasKnownWebFontInfo,
  };
}

function Board({ user }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const searchQuery = searchParams.get("search") ?? "";
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsErrorMessage, setPostsErrorMessage] = useState("");
  const { copyShareLink, shareMessage } = useShareLink({
    successMessage: "링크가 복사되었습니다. 좋은 폰트는 나눠야죠.",
  });
  const shouldShowScrollTopButton = useScrollThreshold();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const hasVisiblePosts = posts.length > 0;
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, pageIndex) => pageIndex + 1,
  );
  const emptyMessage = searchQuery
    ? "검색 결과가 없어요."
    : "아직 기록된 폰트 보드가 없어요.";
  const currentBoardPath = `/${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const updateBoardSearchParams = ({ page = currentPage, search = searchQuery }, options = {}) => {
    const nextSearchParams = new URLSearchParams();
    const normalizedSearch = search.trim();

    if (page > 1) {
      nextSearchParams.set("page", String(page));
    }

    if (normalizedSearch) {
      nextSearchParams.set("search", normalizedSearch);
    }

    setSearchParams(nextSearchParams, options);
  };

  const handleSearchChange = (event) => {
    updateBoardSearchParams(
      {
        page: 1,
        search: event.target.value,
      },
      { replace: true },
    );
    setIsLoadingPosts(true);
    setPostsErrorMessage("");
  };

  const handleClearSearch = () => {
    updateBoardSearchParams({ page: 1, search: "" }, { replace: true });
    setIsLoadingPosts(true);
    setPostsErrorMessage("");
  };

  const handlePreviousPage = () => {
    if (!isFirstPage) {
      updateBoardSearchParams({ page: currentPage - 1 });
      setIsLoadingPosts(true);
      setPostsErrorMessage("");
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      updateBoardSearchParams({ page: currentPage + 1 });
      setIsLoadingPosts(true);
      setPostsErrorMessage("");
    }
  };

  const handleSelectPage = (pageNumber) => {
    updateBoardSearchParams({ page: pageNumber });
    setIsLoadingPosts(true);
    setPostsErrorMessage("");
  };

  const handleWriteClick = () => {
    if (user) {
      navigate("/write", { state: { boardPath: currentBoardPath } });
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

    getPosts({
      page: currentPage,
      pageSize: postsPerPage,
      searchQuery,
    })
      .then((postResponse) => {
        if (!isMounted) {
          return;
        }

        const boardPosts = (postResponse.items ?? []).map((post) =>
          createBoardPostCardData(post),
        );

        setPosts(boardPosts);
        setTotalPages(postResponse.total_pages ?? 1);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setPostsErrorMessage(error.message);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsLoadingPosts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery]);

  return (
    <main className="p-6">
      <div className="mx-auto flex w-full max-w-[720px] justify-end pt-6">
        <div className="relative">
          <IconButton
            ariaLabel="페이지 링크 복사"
            className="h-10 w-10 rounded-md border border-gray-300"
            onClick={copyShareLink}
            size="sm"
            variant="ghost"
          >
            <ShareIcon className="h-4 w-4" />
          </IconButton>
          {shareMessage ? (
            <p className="absolute right-0 top-12 z-20 w-max rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-black shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              {shareMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-center pt-4">
        <p className="mb-5 text-center text-base font-normal text-black">
          글에 어울리는 폰트를 검색하고 기록해보세요
        </p>
        <SearchInput
          ariaLabel="게시글 검색"
          className="w-full max-w-[360px]"
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          placeholder="제목, 폰트 이름 등 검색어를 입력하세요"
          value={searchQuery}
        />
      </div>

      {isLoadingPosts ? (
        <section
          aria-label="게시글 목록을 불러오는 중"
          className="mt-20 grid min-h-[820px] grid-cols-3 content-start gap-x-6 gap-y-10"
        >
          {Array.from({ length: skeletonPostCount }, (_, index) => (
            <PostCardSkeleton key={`post-skeleton-${index}`} />
          ))}
        </section>
      ) : postsErrorMessage ? (
        <StateSection minHeight="sm" tone="error">
          {postsErrorMessage}
        </StateSection>
      ) : hasVisiblePosts ? (
        <>
          <section className="mt-20 grid min-h-[820px] grid-cols-3 content-start gap-x-6 gap-y-10">
            {posts.map((post) => (
              <PostCard
                boardPath={currentBoardPath}
                key={post.id}
                post={post}
              />
            ))}
          </section>

          <nav
            aria-label="게시글 페이지"
            className="mt-12 mb-16 flex items-center justify-center gap-4"
          >
            <PaginationButton
              disabled={isFirstPage}
              onClick={handlePreviousPage}
              variant="edge"
            >
              이전
            </PaginationButton>
            <div className="flex items-center gap-2">
              {pageNumbers.map((pageNumber) => {
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <PaginationButton
                    aria-current={isCurrentPage ? "page" : undefined}
                    isActive={isCurrentPage}
                    key={pageNumber}
                    onClick={() => handleSelectPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationButton>
                );
              })}
            </div>
            <PaginationButton
              disabled={isLastPage}
              onClick={handleNextPage}
              variant="edge"
            >
              다음
            </PaginationButton>
          </nav>
        </>
      ) : (
        <StateSection minHeight="sm">
          {emptyMessage}
          <br />
          첫 문장을 입력하고 어울리는 폰트를 찾아보세요.
        </StateSection>
      )}

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
    </main>
  );
}

export default Board;
