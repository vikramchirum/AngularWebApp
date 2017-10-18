import { TduAction } from "../enums/tduAction";

export interface IMeterActionDate {
  Date: Date;
  Actions: [ TduAction ];
}
