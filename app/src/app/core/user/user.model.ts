export class User {
    username: string = "";
    password: string = "";
    name: string = "";
    admin: boolean = false;

    constructor(username = "", password = "", name = "", admin = false) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.admin = admin;
    };
}