import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { createPost, getPost, updatePost } from "../api/posts";
import FontRecommendationHeader from "../components/FontRecommendationHeader";
import PreservedText from "../components/PreservedText";
import TypingWaitingMessage from "../components/TypingWaitingMessage";
import Button from "../components/ui/Button";
import SegmentedToggle from "../components/ui/SegmentedToggle";
import StateSection from "../components/ui/StateSection";
import TabButton from "../components/ui/TabButton";
import Textarea from "../components/ui/Textarea";
import TextInput from "../components/ui/TextInput";
import useFontRecommendation from "../hooks/useFontRecommendation";

const POST_TYPE_POST = "post";
const POST_TYPE_NOTICE = "notice";
const noticeRecommendationReason = "관리자 계정으로 공지를 등록중입니다.";
const noticeRecommendation = {
  downloadUrl: "#",
  id: null,
  isDefaultFontApplied: false,
  isPaid: false,
  license: "사이트 기본 폰트",
  licenseSummary: [],
  name: "Pretendard",
  previewFontStyle: {
    fontFamily: "\"Pretendard\", sans-serif",
    fontWeight: 400,
  },
  reason: noticeRecommendationReason,
  source: "site",
  sourceUrl: "#",
  tags: ["notice", "system"],
  usage: "기본",
  webfonts: [],
};
const postTypeOptions = [
  { label: "일반", value: POST_TYPE_POST },
  { label: "공지", value: POST_TYPE_NOTICE },
];

function Write({ onAuthExpired = () => {}, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditMode = Boolean(postId);
  const boardPath = location.state?.boardPath ?? "/";
  const detailPath = location.state?.detailPath ?? `/posts/${postId}`;
  const [activeTab, setActiveTab] = useState("write");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState(POST_TYPE_POST);
  const [isLoadingPost, setIsLoadingPost] = useState(isEditMode);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postErrorMessage, setPostErrorMessage] = useState("");
  const isPreviewTab = activeTab === "preview";
  const isAdmin = user?.role === "admin";
  const isNoticePost = isAdmin && postType === POST_TYPE_NOTICE;
  const {
    isRecommending,
    recommendation,
    requestRecommendation,
    setRecommendationFromPost,
    typedRecommendationReason,
    waitingMessage,
  } = useFontRecommendation({
    isPreviewTab,
    onError: setPostErrorMessage,
  });
  const visibleRecommendation = isNoticePost ? noticeRecommendation : recommendation;
  const hasRecommendation = isPreviewTab && visibleRecommendation;
  const defaultFontMessage =
    "웹폰트가 없어 기본 폰트로 표시됐어요.";
  const shouldShowDefaultFontNotice =
    isPreviewTab && recommendation?.isDefaultFontApplied;
  const hasDefaultFontDownloadUrl =
    typeof recommendation?.downloadUrl === "string" &&
    recommendation.downloadUrl.trim() !== "" &&
    recommendation.downloadUrl !== "#";
  const previewText = content;

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let shouldUpdateState = true;

    const loadPostForEdit = async () => {
      setIsLoadingPost(true);
      setPostErrorMessage("");

      try {
        const post = await getPost(postId);

        if (!shouldUpdateState) {
          return;
        }

        setTitle(post.title ?? "");
        setContent(post.content ?? "");
        setPostType(post.post_type ?? POST_TYPE_POST);
        setRecommendationFromPost(post);
        setActiveTab("write");
      } catch (error) {
        if (shouldUpdateState) {
          setPostErrorMessage(error.message);
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoadingPost(false);
        }
      }
    };

    loadPostForEdit();

    return () => {
      shouldUpdateState = false;
    };
  }, [isEditMode, postId, setRecommendationFromPost]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setPostErrorMessage("");
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setPostErrorMessage("");
  };

  const handleRecommend = async () => {
    if (isNoticePost) {
      return;
    }

    await requestRecommendation(content, {
      onStart: () => setActiveTab("preview"),
    });
  };

  const handlePostTypeChange = (nextPostType) => {
    setPostType(nextPostType);
    setPostErrorMessage("");
  };

  const handleSubmitPost = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const selectedFontId = isNoticePost ? null : recommendation?.id;
    const recommendReason = isNoticePost
      ? noticeRecommendationReason
      : recommendation?.reason?.trim();

    if (!trimmedTitle) {
      setPostErrorMessage("제목을 입력해주세요.");
      return;
    }

    if (!trimmedContent) {
      setPostErrorMessage("게시글 내용을 입력해주세요.");
      return;
    }

    if (!isNoticePost && !selectedFontId) {
      setPostErrorMessage("폰트 추천 후 등록할 수 있어요.");
      return;
    }

    if (!recommendReason) {
      setPostErrorMessage("추천 이유가 필요해요.");
      return;
    }

    setIsSubmittingPost(true);
    setPostErrorMessage("");

    try {
      const createdPost = await createPost({
        title: trimmedTitle,
        content,
        fontId: selectedFontId,
        postType,
        recommendReason,
      });

      navigate(`/posts/${createdPost.id}`, { state: { boardPath } });
    } catch (error) {
      if (error.status === 401) {
        onAuthExpired();
        return;
      }

      setPostErrorMessage(error.message);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleUpdatePost = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const selectedFontId = isNoticePost ? null : recommendation?.id;
    const recommendReason = isNoticePost
      ? noticeRecommendationReason
      : recommendation?.reason?.trim();

    if (!trimmedTitle) {
      setPostErrorMessage("제목을 입력해주세요.");
      return;
    }

    if (!trimmedContent) {
      setPostErrorMessage("게시글 내용을 입력해주세요.");
      return;
    }

    if (!isNoticePost && !selectedFontId) {
      setPostErrorMessage("폰트 정보가 필요해요.");
      return;
    }

    if (!recommendReason) {
      setPostErrorMessage("추천 이유가 필요해요.");
      return;
    }

    setIsSubmittingPost(true);
    setPostErrorMessage("");

    try {
      await updatePost(postId, {
        title: trimmedTitle,
        content,
        fontId: selectedFontId,
        postType,
        recommendReason,
      });

      navigate(detailPath, { state: { boardPath } });
    } catch (error) {
      if (error.status === 401) {
        onAuthExpired();
        return;
      }

      setPostErrorMessage(error.message);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const isPreviewDisabled = !isNoticePost && !recommendation && !isRecommending;

  return (
    <main className="min-h-[620px] p-6">
      <section
        className={[
          "mx-auto flex w-full max-w-[720px] flex-col pb-10",
          "pt-8",
        ].join(" ")}
      >
        <Button
          as={Link}
          className="mb-16 inline-flex self-start no-underline"
          size="inline"
          to={isEditMode ? detailPath : boardPath}
          variant="text"
        >
          {isEditMode ? "게시글로" : "목록으로"}
        </Button>

        {isEditMode && isLoadingPost ? (
          <StateSection as="div">게시글을 불러오는 중...</StateSection>
        ) : (
          <>
            <FontRecommendationHeader
              emptyMessage="문장을 입력하고 폰트 추천을 눌러보세요."
              font={hasRecommendation ? visibleRecommendation : null}
              isLogoAnimated={hasRecommendation && !isNoticePost}
              reason={
                isNoticePost
                  ? noticeRecommendationReason
                  : typedRecommendationReason
              }
            />

            <TextInput
              className="mt-20"
              maxLength={100}
              onChange={handleTitleChange}
              placeholder="제목을 입력하세요."
              type="text"
              value={title}
              variant="underline"
            />

            <div
              className={[
                "relative z-10 mt-10 flex items-end gap-1 pl-2",
                isPreviewTab ? "border-b border-gray-200" : "-mb-px",
              ].join(" ")}
            >
              <TabButton
                active={activeTab === "write"}
                onClick={() => setActiveTab("write")}
              >
                Write
              </TabButton>
              <TabButton
                active={activeTab === "preview"}
                disabled={isPreviewDisabled}
                onClick={() => setActiveTab("preview")}
              >
                Preview
              </TabButton>
              <div className="ml-auto mb-1 flex items-center gap-3">
                {shouldShowDefaultFontNotice ? (
                  <p className="inline-flex items-center gap-2 text-xs text-[#d4d4d4]">
                    <span>{defaultFontMessage}</span>
                    {hasDefaultFontDownloadUrl ? (
                      <a
                        className="text-black underline-offset-2 transition-colors hover:text-[#d4d4d4] hover:underline"
                        href={recommendation.downloadUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        폰트 보러가기
                      </a>
                    ) : (
                      <span className="text-black">
                        다운로드 페이지를 확인해주세요.
                      </span>
                    )}
                  </p>
                ) : null}
                {isAdmin ? (
                  <SegmentedToggle
                    ariaLabel="게시글 유형"
                    onChange={handlePostTypeChange}
                    options={postTypeOptions}
                    value={postType}
                  />
                ) : null}
              </div>
            </div>
            <div className="min-h-[380px]">
              {activeTab === "write" ? (
                <>
                  <Textarea
                    maxLength={1500}
                    onChange={handleContentChange}
                    placeholder="게시글 내용을 입력하세요. 1500자 이내"
                    size="post"
                    value={content}
                    withThinScrollbar
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      className="min-w-[86px]"
                      disabled={isRecommending || isNoticePost}
                      onClick={handleRecommend}
                    >
                      {isRecommending ? "추천 중.." : "폰트 추천"}
                    </Button>
                  </div>
                  <p className="mt-2 text-right text-xs text-[#d4d4d4]">
                    {isNoticePost
                      ? "공지는 Pretendard 400으로 등록돼요."
                      : "문장을 수정하면 다른 폰트가 추천될 수 있어요."}
                  </p>
                </>
              ) : (
                <div className="relative min-h-[380px]">
                  <div
                    className={[
                      "transition duration-300",
                      isRecommending ? "blur-[2px]" : "blur-0",
                    ].join(" ")}
                  >
                    {visibleRecommendation ? (
                      <div>
                        <div className="flex h-52 items-stretch border-b border-black">
                          <div className="thin-transparent-scrollbar h-full w-full overflow-y-auto px-5 pt-4 pb-3">
                            <PreservedText
                              className="text-[22px] leading-relaxed text-black"
                              style={visibleRecommendation.previewFontStyle}
                              text={previewText}
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button
                            disabled={isSubmittingPost}
                            onClick={
                              isEditMode ? handleUpdatePost : handleSubmitPost
                            }
                          >
                            {isSubmittingPost
                              ? isEditMode
                                ? "수정 중..."
                                : "등록 중..."
                              : isEditMode
                                ? "수정하기"
                                : "등록 하기"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-52 rounded-md border border-gray-200" />
                    )}
                  </div>

                  {isRecommending ? (
                    <div className="absolute inset-x-0 top-0 flex h-52 items-center justify-center">
                      <div className="rounded-md bg-white/80 px-8 py-6 text-center">
                        <TypingWaitingMessage lines={waitingMessage} />
                      </div>
                    </div>
                  ) : null}
                  <p className="mt-2 min-h-4 text-right text-xs text-black">
                    {postErrorMessage}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Write;
