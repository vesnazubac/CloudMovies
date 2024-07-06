export class RecordGetDTO {
    username: string|null;
    type: string;
    content: number;
    id_filma:string;
    naslov:string;
    timestamp:string;
  
    constructor(username: string, type: string, content: number,id_filma:string,naslov:string,timestamp:string) {
      this.username = username;
      this.type = type;  
      this.content = content;
      this.id_filma=id_filma;
      this.naslov=naslov;
      this.timestamp=timestamp
    }
  }
  