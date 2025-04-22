import Rating from "@mui/material/Rating";

export default function ReviewCard({ review, key }) {
  return (
    <div
      className="review-card bg-white dark:bg-[var(--dark-bg-2)] rounded-xl p-3 w-68 h-52 overflow-y-auto"
      key={key}
    >
      {" "}
      <p className="flex items-center font-semibold">
        <u>
          {review.author.fullname.firstname +
            " " +
            review.author.fullname.lastname}
        </u>
        <Rating
          name="read-only"
          value={review.rating}
          className="ml-auto"
          readOnly
        />
      </p>
      <p className="mt-4 italic text-ellipsis text-sm">
        {'"' + review.comment + '"'}
      </p>
    </div>
  );
}
