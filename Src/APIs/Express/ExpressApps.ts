import NDBClient from "@Client/NDBClient";
import express from "express";
import RPC from "./Apps/RPC";

export default class ExpressApps {
  public RPC: RPC;
  constructor(private client: NDBClient) {
    this.client = client;
    this.RPC = new RPC(client);
  }

  async InitAll() {
    await this.RPC.App();
  }
}
