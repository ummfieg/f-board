import { useEffect, useState } from "react";
import { getMyBoard } from "../api/auth";
import { ArchiveBoxIcon, HandRaisedIcon } from "../components/icons";
import MyPageAccordionSection from "../components/MyPageAccordionSection";
import MyPagePostLink from "../components/MyPagePostLink";
import StateMessage from "../components/ui/StateMessage";
import TextActionButton from "../components/ui/TextActionButton";

function createMyPostItem(post) {
  return {
    fontName: post.font?.name ?? "Unknown",
    id: post.id,
    title: post.title,
  };
}

function createUsedFontItem(fontGroup) {
  return {
    fontName: fontGroup.font_name,
    posts: fontGroup.posts ?? [],
  };
}

function MyPage({ onLogout, user }) {
  const nickname = user?.nickname ?? "guest";
  const [myPosts, setMyPosts] = useState([]);
  const [usedFonts, setUsedFonts] = useState([]);
  const [isLoadingMyBoard, setIsLoadingMyBoard] = useState(true);
  const [myBoardErrorMessage, setMyBoardErrorMessage] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasMyPosts = myPosts.length > 0;
  const hasUsedFonts = usedFonts.length > 0;

  useEffect(() => {
    let shouldUpdateState = true;

    const loadMyBoard = async () => {
      setIsLoadingMyBoard(true);
      setMyBoardErrorMessage("");

      try {
        const myBoardResponse = await getMyBoard();

        if (!shouldUpdateState) {
          return;
        }

        setMyPosts((myBoardResponse.posts ?? []).map(createMyPostItem));
        setUsedFonts(
          (myBoardResponse.used_fonts ?? []).map(createUsedFontItem),
        );
      } catch (error) {
        if (shouldUpdateState) {
          if (error.status === 401) {
            await onLogout({ shouldRequestLogout: false });
            return;
          }

          setMyBoardErrorMessage("정보를 불러오지 못했어요.");
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoadingMyBoard(false);
        }
      }
    };

    loadMyBoard();

    return () => {
      shouldUpdateState = false;
    };
  }, [onLogout]);

  const handleLogoutClick = async () => {
    setLogoutMessage("");
    setIsLoggingOut(true);

    try {
      await onLogout();
    } catch (error) {
      setLogoutMessage(error.message);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-96px)] flex-col p-6">
      <section className="mx-auto flex w-full max-w-[380px] flex-col items-center pt-[120px]">
        <span className="animate-tilt-once font-['Zodiak'] text-[35pt] font-extrabold italic leading-none text-black">
          f
        </span>

        <p className="mt-4 flex min-h-6 items-center justify-center gap-2 text-center text-base font-normal text-black">
          <span>안녕하세요 {nickname} 님</span>
          <HandRaisedIcon className="h-5 w-5" />
        </p>

        <TextActionButton
          className="mt-2"
          disabled={isLoggingOut}
          onClick={handleLogoutClick}
          variant="subtle"
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </TextActionButton>
        <p className="mt-2 min-h-5 text-center text-sm text-neutral-600">
          {logoutMessage}
        </p>

        <div className="mt-5 w-full overflow-hidden rounded-md border border-gray-300">
          <MyPageAccordionSection
            emptyMessage="아직 등록한 게시물이 없어요."
            icon={<ArchiveBoxIcon className="h-4 w-4" />}
            isEmpty={!hasMyPosts}
            isLoading={isLoadingMyBoard}
            loadingMessage="게시물을 불러오는 중..."
            title="내가 등록한 게시물"
            withBottomBorder
          >
            {myPosts.map((post) => (
              <li key={post.id}>
                <MyPagePostLink className="py-1.5" to={`/posts/${post.id}`}>
                  {post.title}
                </MyPagePostLink>
              </li>
            ))}
          </MyPageAccordionSection>

          <MyPageAccordionSection
            emptyMessage="아직 사용한 폰트가 없어요."
            icon={
              <span className="font-['Zodiak'] text-[17px] font-extrabold italic leading-none text-black">
                f
              </span>
            }
            isEmpty={!hasUsedFonts}
            isLoading={isLoadingMyBoard}
            loadingMessage="폰트 기록을 불러오는 중..."
            maxHeight="fonts"
            title="내가 사용한 폰트"
          >
            {usedFonts.map((fontGroup) => (
              <li className="py-1.5 text-sm text-black" key={fontGroup.fontName}>
                <p className="font-semibold">
                  {fontGroup.fontName}
                  <span className="ml-2 text-xs font-normal text-[#d4d4d4]">
                    {fontGroup.posts.length}
                  </span>
                </p>
                <ul className="mt-1">
                  {fontGroup.posts.map((post) => (
                    <li key={post.id}>
                      <MyPagePostLink className="py-1" to={`/posts/${post.id}`}>
                        {post.title}
                      </MyPagePostLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </MyPageAccordionSection>
        </div>
        <StateMessage className="mt-2 min-h-5 text-center" tone="error">
          {myBoardErrorMessage}
        </StateMessage>
      </section>
    </main>
  );
}

export default MyPage;
