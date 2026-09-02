import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotices } from "../api/posts";
import useShareLink from "../hooks/useShareLink";
import { ShareIcon } from "./icons";
import IconButton from "./ui/IconButton";

function NoticeTicker() {
  const [notices, setNotices] = useState([]);
  const { copyShareLink, shareMessage } = useShareLink({
    successMessage: "링크가 복사되었습니다. 좋은 폰트는 나눠야죠.",
  });

  useEffect(() => {
    let isMounted = true;

    getNotices({ limit: 5 })
      .then((noticeResponse) => {
        if (!isMounted) {
          return;
        }

        setNotices(noticeResponse.items ?? []);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setNotices([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (notices.length === 0) {
    return null;
  }

  const hasMultipleNotices = notices.length > 1;
  const tickerItems = hasMultipleNotices ? [...notices, ...notices] : notices;

  return (
    <section
      aria-label="공지"
      className="relative border-b border-gray-200 bg-white text-black"
    >
      <div className="overflow-hidden py-2 pl-6 pr-20">
        <div
          className={[
            "inline-flex w-max items-center gap-10 whitespace-nowrap",
            hasMultipleNotices ? "notice-ticker-track" : "",
          ].join(" ")}
        >
          {tickerItems.map((notice, index) => {
            const noticeNumber = (index % notices.length) + 1;

            return (
              <Link
                className="inline-flex items-center gap-1 text-xs leading-none text-gray-500 no-underline transition-colors hover:text-black focus-visible:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-black"
                key={`${notice.id}-${index}`}
                state={{ boardPath: "/" }}
                to={`/posts/${notice.id}`}
              >
                <span className="font-semibold">{noticeNumber}.</span>
                <span>{notice.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="absolute right-6 top-full z-20 mt-2">
        <div className="relative">
          <IconButton
            ariaLabel="페이지 링크 복사"
            onClick={copyShareLink}
            size="floating"
            variant="floating"
          >
            <ShareIcon className="h-5 w-5" />
          </IconButton>
          {shareMessage ? (
            <p className="absolute right-0 top-10 z-20 w-max rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-black shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              {shareMessage}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default NoticeTicker;
