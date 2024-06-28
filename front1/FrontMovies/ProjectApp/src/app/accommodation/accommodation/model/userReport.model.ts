export interface UserReport{
    id?:number;
    userThatReports:String;
    userThatIsReported:String; 
    reason:String;
}