export class DVGetDTO {
    username: string|null;
    type: string;
    id_filma:string;
    naslov:string;
    timestamp:string;
  
    constructor(username: string, type: string,id_filma:string,naslov:string,timestamp:string) {
      this.username = username;
      this.type = type;       //view , download
      this.id_filma=id_filma;
      this.naslov=naslov;
      this.timestamp=timestamp;
    }
  }
  