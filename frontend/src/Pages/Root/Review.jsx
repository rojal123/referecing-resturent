import { useState } from "react";
import api from "../../api.js";
import "./review.css";

const STAR_LABELS = ["Poor", "Fair", "Good", "Great", "Excellent"];

export default function ReviewModal({ fullName, userId, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const displayRating = hoverRating || rating;

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating < 1) {
      setStatus("error");
      setErrorMessage("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setStatus("error");
      setErrorMessage("Please add a few words about your experience.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      await api.post("/reviews", { fullName, rating, comment, userId });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err?.response?.data?.message || "Could not submit your review. Please try again."
      );
    }
  }

  return (
    <div className="review-modal-overlay" role="dialog" aria-modal="true">
      <div className="review-modal">
        <button
          type="button"
          className="review-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {status === "success" ? (
          <div className="review-modal__success">
            <h3>Thank you, {fullName.split(" ")[0]}!</h3>
            <p>Your review has been submitted.</p>
            <button type="button" className="review-modal__submit" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h3>How was your order?</h3>
            <p className="review-modal__subtitle">
              Your feedback helps us keep improving Tavola.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="review-modal__stars" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`review-modal__star ${value <= displayRating ? "filled" : ""}`}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  >
                    &#9733;
                  </button>
                ))}
              </div>
              {displayRating > 0 && (
                <p className="review-modal__star-label">{STAR_LABELS[displayRating - 1]}</p>
              )}

              <textarea
                className="review-modal__textarea"
                placeholder="Tell us about the food, service, or anything else..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />

              {status === "error" && (
                <p className="review-modal__error">{errorMessage}</p>
              )}

              <div className="review-modal__actions">
                <button type="button" className="review-modal__skip" onClick={onClose}>
                  Maybe later
                </button>
                <button
                  type="submit"
                  className="review-modal__submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}