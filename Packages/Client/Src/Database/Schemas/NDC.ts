//! Ignore

//* SCHEMA SOMENTE PARA O SERVIDOR NedcloarBR Community (http://discord.gg/5CHARxbaRk)

import { Schema, model, SchemaTypes } from "mongoose";

const NDCSchema: Schema = new Schema({
  Auth: {
    type: SchemaTypes.String,
    default: process.env.AuthNDC,
  },
  RolesMsgId: SchemaTypes.String,
});

const NDC = model("NDCDatabase", NDCSchema);
export default NDC;
