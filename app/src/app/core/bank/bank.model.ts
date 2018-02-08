export class bank {
    public _id: string;
    name: string = "";
    number: number = 0;
    bank: number = 0;
    account: number = 0;
    intialvalue: number = 0;
    data: Date = new Date();
    active: boolean = true;
    saveaccount: boolean = false;

    constructor(name = "", number = 0, bank = 0, account = 0, intialvalue = 0, data =new Date(), active = true, saveaccount = false) {
        this.name = name;
        this.number = number;
        this.account = account;
        this.intialvalue = intialvalue;
        this.data = data;
        this.active = active;
        this.saveaccount = saveaccount;
    };
}
