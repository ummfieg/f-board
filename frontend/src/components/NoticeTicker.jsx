import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotices } from "../api/posts";

function NoticeTicker() {
  const [notices, setNotices] = useState([]);

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

  const tickerItems = [...notices, ...notices];

  return (
    <section aria-label="공지" className="bg-black text-white">
      <div className="overflow-hidden px-6 py-2">
        <div className="notice-ticker-track inline-flex w-max items-center gap-10 whitespace-nowrap">
          {tickerItems.map((notice, index) => {
            const noticeNumber = (index % notices.length) + 1;

            return (
              <Link
                className="inline-flex items-center gap-1 text-xs leading-none text-white no-underline opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
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
    </section>
  );
}

export default NoticeTicker;
