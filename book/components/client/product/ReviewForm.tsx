// components/client/product/ReviewForm.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
} from "@nextui-org/react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { deleteReview, submitReview } from "../review/actions";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { Review } from "@/types/types";

const StarRating = ({
  rating,
  onRatingChange,
  readOnly = false,
}: {
  rating: number;
  onRatingChange?: (value: number) => void;
  readOnly?: boolean;
}) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= rating;
        return (
          <span
            key={star}
            onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
            className={`cursor-pointer text-3xl transition-colors duration-300 ${isActive
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-300 hover:text-gray-400"
              } ${readOnly ? "cursor-default" : ""}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

type ReviewFormProps = {
  bookId: number;
  review: Review | null;
  onAddReview: () => void;
  deleteReview: () => void;
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  review,
  onAddReview,
  deleteReview: deleteReviewParent,
}) => {
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { token } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState<boolean>(review ? false : true);
  const { t } = useTranslation();
  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    if (review) {
      setReviewContent(review.content || "");
      setReviewRating(review.rating || 5);
      setIsEditing(false);
    } else {
      setReviewContent("");
      setReviewRating(5);
      setIsEditing(true);
    }
  }, [review]);

  const handleSubmit = async () => {
    if (!reviewContent.trim()) {
      alert("Please provide a review content.");
      return;
    }
    if (!isLoggedIn) {
      alert("You need to log in to add or edit a review.");
      return;
    }

    try {
      await submitReview(token, bookId, review?.reviewId || null, reviewRating, reviewContent);
      alert(review ? "Review updated successfully!" : "Review submitted successfully!");
      onAddReview();
      if (review) {
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error submitting review");
    }
  };

  const handleDelete = async () => {
    if (!review) return;
    try {
      await deleteReview(token, bookId, review.reviewId);
      alert("Review deleted successfully!");
      deleteReviewParent();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error deleting review");
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  // Gdy user anuluje edycję
  const handleCancelEditing = () => {
    setIsEditing(false);
    if (review) {
      setReviewContent(review.content);
      setReviewRating(review.rating);
    }
  };

  // *** RENDER ***
  // 1) Jeśli user nie jest zalogowany => informacja, że trzeba się zalogować
  if (!isLoggedIn) {
    return (
      <Card className="mx-auto bg-primary-100 shadow-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {review ? "Your Review" : "Add Your Review"}
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-red-500 text-center">
            {t("pleasAddReview")}
          </p>
        </CardBody>
      </Card>
    );
  }

  // 2) Jeśli user jest zalogowany i NIE ma recenzji => tryb dodania
  if (!review) {
    // w tym trybie isEditing = true (zainicjowane w useEffect)
    return (
      <Card className="mx-auto bg-primary-100 shadow-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">{t("addYourReview")}</h2>
        </CardHeader>
        <CardBody>
          {/* Pola do wpisania recenzji */}
          <label className="block mb-2 text-sm font-medium">{t("yourRating")}:</label>
          <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
          <Textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder={t("writeReview")}
            className="w-full mt-3"
            minRows={4}
          />
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button onPress={handleSubmit} className="bg-blue-500 text-white">
            {t("submitReview")}
          </Button>
        </CardFooter>
      </Card>

    );
  }

  // 3) Jeśli user jest zalogowany i MA recenzję (review != null):
  //    - tryb podglądu (isEditing=false)
  //    - tryb edycji (isEditing=true)

  if (!isEditing) {
    // *** TRYB PODGLĄDU ***

    return (
      <Card className="mx-auto bg-primary-100 shadow-md">
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("yourReview")}</h2>
          <div className="flex items-center space-x-3">
            {/* Ikona edycji */}
            <AiOutlineEdit
              onClick={handleStartEditing}
              className="cursor-pointer text-2xl text-blue-500 hover:text-blue-600"
            />
            {/* Ikona kosza */}
            <AiOutlineDelete
              onClick={onOpen}
              className="cursor-pointer text-2xl text-red-500 hover:text-red-600"
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">{t("rating")}:</label>
            <StarRating rating={review.rating} readOnly />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">{t("review")}:</label>
            <p className="whitespace-pre-wrap">{review.content}</p>
          </div>
        </CardBody>


        {/* Modal potwierdzenia usunięcia */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>{t("confirmDeletion")}</ModalHeader>
                <ModalBody>
                  <p>{t("deleteReviewQuestion")}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" onPress={onClose}>
                    {t("cancel")}
                  </Button>
                  <Button
                    color="danger"
                    className="bg-red-500 text-white"
                    onPress={() => {
                      handleDelete();
                      onClose();
                    }}
                  >
                    {t("confirm")}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

      </Card>
    );
  }

  // *** TRYB EDYCJI (isEditing = true) ***
  return (
    <Card className="mx-auto bg-primary-100 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("editYourReview")}</h2>
        <AiOutlineDelete
          onClick={onOpen}
          className="cursor-pointer text-2xl text-red-500 hover:text-red-600"
        />
      </CardHeader>
      <CardBody>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">{t("yourRating")}:</label>
          <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
        </div>
        <Textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder={t("writeReview")}
          className="w-full"
          minRows={4}
        />
      </CardBody>
      <CardFooter className="flex justify-end space-x-4">
        <Button color="default" onPress={handleCancelEditing}>
          {t("cancel")}
        </Button>
        <Button onPress={handleSubmit} className="bg-blue-500 text-white">
          {t("updateReview")}
        </Button>
      </CardFooter>


      {/* Modal potwierdzenia usunięcia */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t("confirmDeletion")}</ModalHeader>
              <ModalBody>
                <p>{t("deleteReviewQuestion")}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button
                  color="danger"
                  className="bg-red-500 text-white"
                  onPress={() => {
                    handleDelete();
                    onClose();
                  }}
                >
                  {t("confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default ReviewForm;
