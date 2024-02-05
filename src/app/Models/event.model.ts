import { Session } from "./session.model";
import { Ticket } from "./ticket.model";

export interface Event {
  eventId: number;
  description: string;
  dateEvent: Date;
  cat: EventCategory;
  imgEvent:string;
  available: boolean;
  session?: Session;
  tickets:Ticket[];
}

export enum EventCategory {
  FILM = 'FILM',
  MUSIQUE= 'MUSIQUE',
  DANCE = 'DANCE',
  SPORT ='SPORT',
 COMEDY='COMEDY' ,
  THEATRE ='THEATRE',
  DINNER = 'DINNER',
  CLUBBING = 'CLUBBING',
  CONCERT = 'CONCERT',
  EXPOSITION = 'EXPOSITION',
  GAMES = 'GAMES',
  FAIRS_EXHIBITION='FAIRS_EXHIBITION'
}
