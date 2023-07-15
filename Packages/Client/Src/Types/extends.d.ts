import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ActionRowData,
  JSONEncodable,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData
} from "discord.js";

export type mixedComponentType =
  | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
  | ActionRowData<
      MessageActionRowComponentData | MessageActionRowComponentBuilder
    >
  | APIActionRowComponent<APIMessageActionRowComponent>;
