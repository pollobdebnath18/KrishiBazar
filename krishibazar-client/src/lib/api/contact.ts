import { apiClient } from "./client";

export interface Contact {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function createContact(data: Contact) {
    return apiClient("/contact", {
        method: "POST",
        body: JSON.stringify(data)
    })
}