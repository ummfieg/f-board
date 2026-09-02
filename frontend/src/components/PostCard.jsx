import { Link } from "react-router-dom";
import { ChatBubbleOvalLeftIcon } from "./icons";
import PreservedText from "./PreservedText";

function PostCard({ boardPath, post }) {
  return (
    <article className="min-w-0 rounded-md shadow-[0_0_12px_rgba(15,23,42,0.06)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_0_18px_rgba(15,23,42,0.1)]">
      <Link
        className="block cursor-pointer p-4"
        state={{ boardPath }}
        to={`/posts/${post.id}`}
      >
        <div className="flex min-w-0 items-center gap-2 text-[13px] text-[#d4d4d4]">
          <time className="shrink-0" dateTime={post.dateTime}>
            {post.date}
          </time>
          <span aria-hidden="true" className="shrink-0">
            •
          </span>
          <span className="max-w-[120px] truncate rounded-full border border-gray-200 bg-[#F8F9FA] px-2 py-0.5 text-xs font-medium text-black">
            {post.fontName}
          </span>
          {post.hasKnownWebFontInfo && !post.hasWebFont ? (
            <span className="shrink-0 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-[#d4d4d4]">
              웹폰트 없음
            </span>
          ) : null}
        </div>

        <h2 className="line-clamp-2 mt-3 min-h-[40px] break-words text-base font-bold leading-tight text-black">
          {post.title}
        </h2>

        <div className="mt-3 h-24 overflow-hidden rounded-md border border-gray-200 px-4 py-3">
          <PreservedText
            className="text-[20px] leading-relaxed text-black"
            style={post.previewFontStyle}
            text={post.previewText}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-black">
          <p className="min-w-0 truncate font-semibold">{post.nickname}</p>
          <span className="flex shrink-0 items-center gap-1 text-[#6b7280]">
            <ChatBubbleOvalLeftIcon className="h-4 w-4" />
            {post.commentCount}
          </span>
        </div>
      </Link>
    </article>
  );
}

export default PostCard;
