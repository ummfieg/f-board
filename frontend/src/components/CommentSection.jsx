import { ChatBubbleLeftEllipsisIcon } from "./icons";
import CommentItem from "./CommentItem";
import Button from "./ui/Button";
import ConfirmDialog from "./ui/ConfirmDialog";
import StateMessage from "./ui/StateMessage";
import Textarea from "./ui/Textarea";

function CommentSection({
  commentContent,
  comments,
  deletingCommentId,
  errorMessage,
  isDeletingComment,
  isSubmittingComment,
  onCancelDeleteComment,
  onChangeCommentContent,
  onConfirmDeleteComment,
  onCreateComment,
  onRequestDeleteComment,
  user,
}) {
  const hasComments = comments.length > 0;

  return (
    <section className="mt-5 border-t border-black pt-4">
      <div className="flex items-center gap-2 leading-none">
        <ChatBubbleLeftEllipsisIcon className="h-4 w-4 translate-y-px text-black" />
        <h2 className="text-sm font-semibold text-black">comment</h2>
        <span className="text-sm text-black">{comments.length}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Textarea
          className="flex-1"
          onChange={onChangeCommentContent}
          placeholder="댓글을 입력하세요."
          size="comment"
          value={commentContent}
        />
        <Button
          disabled={isSubmittingComment}
          onClick={onCreateComment}
          size="xs"
          variant="text"
        >
          {isSubmittingComment ? "등록 중" : "등록"}
        </Button>
      </div>

      <StateMessage className="mt-2 min-h-5 text-left" tone="error">
        {errorMessage}
      </StateMessage>

      {hasComments ? (
        <ul className="mt-6 space-y-5">
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              key={comment.id}
              onRequestDelete={onRequestDeleteComment}
              user={user}
            />
          ))}
        </ul>
      ) : (
        <StateMessage className="mt-8 text-center">
          첫 댓글을 달아보세요!
        </StateMessage>
      )}

      {deletingCommentId ? (
        <ConfirmDialog
          confirmLabel="삭제"
          isProcessing={isDeletingComment}
          message="삭제한 댓글은 되돌릴 수 없어요."
          onCancel={onCancelDeleteComment}
          onConfirm={onConfirmDeleteComment}
          title="댓글을 삭제할까요?"
        />
      ) : null}
    </section>
  );
}

export default CommentSection;
