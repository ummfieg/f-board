import { XMarkIcon } from "./icons";
import PreservedText from "./PreservedText";
import IconButton from "./ui/IconButton";

function CommentItem({ comment, onRequestDelete, user }) {
  const canDeleteComment = user?.id === comment.userId;

  return (
    <li className="grid grid-cols-[120px_minmax(0,1fr)_auto] items-start gap-4 text-xs">
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
        {canDeleteComment ? (
          <IconButton
            ariaLabel="댓글 삭제"
            onClick={() => onRequestDelete(comment.id)}
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
  );
}

export default CommentItem;
