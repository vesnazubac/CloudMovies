export class DVPostDTO {
    username: string|null;
    type: string;
    id_filma:string;
    naslov:string;
  
    constructor(username: string, type: string,id_filma:string,naslov:string) {
      this.username = username;
      this.type = type;       //view , download
      this.id_filma=id_filma;
      this.naslov=naslov;
    }
  }
  