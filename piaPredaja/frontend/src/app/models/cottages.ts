export class Ocena {
    korime: string = "";
    ocena: number = 0;
}

export class Komentar {
    korime: string = "";
    tekst: string = "";
}

export class Cottage {
    naziv: string = "";
    mesto: string = "";
    usluge: string = "";
    cenaLeto: number = 0;
    cenaZima: number = 0;
    telefon: string = "";
    koordinate = {
        lat: 0,
        lng: 0
    };
    slike: any[] = [];       
    vlasnik: string = "";    
    status: string = "aktivna";
    ocene: Ocena[] = [];
    komentari: Komentar[] = [];
    blokiranaDo: string = "";
}