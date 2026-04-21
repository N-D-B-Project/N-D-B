export enum Tickets {
	Service = "TICKETS_SERVICE",
	Repository = "TICKETS_REPOSITORY",
}

export enum CreateTicketTypeError {
	Exists = "TICKET_TYPE_ALREADY_EXISTS",
	Count = "TICKET_TYPE_LIMIT_REACHED",
}

export enum CreateTicketError {
	AlreadyOpen = "TICKET_ALREADY_OPEN",
}

export enum CloseTicketError {
	NotFound = "TICKET_NOT_FOUND",
	NotInTicketChannel = "NOT_IN_TICKET_CHANNEL",
}

export enum DeleteTicketTypeError {
	NotFound = "TICKET_TYPE_NOT_FOUND",
}

export enum ConfigureTicketTypeError {
	NotFound = "TICKET_TYPE_NOT_FOUND",
}

export interface PanelSettings {
	ticketPanelTitle: string | null;
	ticketPanelDesc: string | null;
	ticketPanelColor: string | null;
	ticketPanelThumbnail: string | null;
	ticketPanelImage: string | null;
	ticketPanelFooter: string | null;
	ticketPanelBtnLabel: string | null;
	ticketPanelBtnEmoji: string | null;
	ticketDefaultRole: string | null;
	ticketDefaultCategory: string | null;
	ticketDefaultMessage: string | null;
}
