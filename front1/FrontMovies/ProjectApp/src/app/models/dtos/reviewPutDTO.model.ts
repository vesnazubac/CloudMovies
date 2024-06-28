import { ReviewEnum } from "src/app/models/enums/reviewEnum";
import { ReviewStatusEnum } from "src/app/models/enums/reviewStatusEnum";
export interface ReviewPutDTO{
    userId:String;
    type:ReviewEnum;  //OWNER or ACCOMMODATION
    comment:String;
    grade:number;
    
    dateTime:Date;
    deleted:boolean;
    reported:boolean;
    accommodationId:number;
    ownerId:String;
   
    status: ReviewStatusEnum;
}