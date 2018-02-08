import {bank} from "../bank/bank.model";
import {category} from "../category/category.model";
export class entry {
    public _id: string;
    constructor(public description = "", public category: category|string = "", public bank: bank|string = "", public value = 0,
                public date: Date = new Date(), public confirmed = false, public credito = false) {
    };
}
