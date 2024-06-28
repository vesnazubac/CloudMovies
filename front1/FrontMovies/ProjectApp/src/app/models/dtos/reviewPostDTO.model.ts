import { ReviewEnum } from "src/app/models/enums/reviewEnum";
import { ReviewStatusEnum } from "src/app/models/enums/reviewStatusEnum";
export interface ReviewPostDTO{
    userId:String;
    type:ReviewEnum;  //OWNER or ACCOMMODATION
    comment:String;
    accommodationId:number;
    ownerId:String |undefined;
    grade:number;
    dateTime:Date;
    deleted:boolean;
    reported:boolean;
    status: ReviewStatusEnum;
    reservationId:number;
}