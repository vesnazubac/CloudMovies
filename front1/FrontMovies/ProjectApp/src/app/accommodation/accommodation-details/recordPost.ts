export class RecordPostDTO {
  username: string|null;
  type: string;
  content: number;  
  id_filma:string;
  naslov:string;

  constructor(username: string, type: string, content: number,id_filma:string,naslov:string) {
    this.username = username;
    this.type = type;       //view , download , rate
    this.content = content;
    this.id_filma=id_filma;
    this.naslov=naslov;
  }
}
