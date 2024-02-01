export class User {
    public id: number;
    public address: string;
    public username: string;
    public role: string;
    public created_at: Date;
    public updated_at: Date;

    constructor(props) {
        this.id = props.id;
        this.address = props.address;
        this.role = props.role;
        this.created_at = props.created_at;
        this.updated_at = props.updated_at;
    }
}
