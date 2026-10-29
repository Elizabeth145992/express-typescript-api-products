import type { RowDataPacket } from "mysql2/promise";

export interface AuthRow extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password_hash: string;
    active: number;
}