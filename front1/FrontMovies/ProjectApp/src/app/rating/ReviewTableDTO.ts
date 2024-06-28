import { Review } from "../accommodation/accommodation/model/review.model";

export interface ReviewTableDTO {
    ownerId: string;
    accommodationId:number;
    numOfReviews:number;
    reviews: Review[];
  }