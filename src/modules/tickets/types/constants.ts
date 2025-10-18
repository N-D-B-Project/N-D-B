export enum Tickets {
	Service = "TICKETS_SERVICE",
	Repository = "TICKETS_REPOSITORY",
}

export enum CreateTicketTypeError {
	Exists = "TICKET_TYPE_ALREADY_EXISTS",
	Count = "TICKET_TYPE_LIMIT_REACHED",
}
