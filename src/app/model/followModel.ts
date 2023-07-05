import { FollowInsideModel } from "./followInisideModel";

export class FollowModel {    
    followId: string |undefined;
    follow: Array<FollowInsideModel> | undefined;
    init_date:string | undefined;
    final_date:string | undefined;      
}