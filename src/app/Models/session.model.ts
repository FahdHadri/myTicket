import { Venue } from "./venue.model";

export class Session {
  sessionId!: number;
  sessionName!: string;
  startDate!: Date;
  finishDate!: Date;
  imgUrl!: string;
  venue!: Venue;
}
