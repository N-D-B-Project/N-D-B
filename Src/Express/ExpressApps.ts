import NDBClient from "@/Client/Client";
import express from "express";
import RPC from "./Apps/RPC";

export default class ExpressApps {
  client: NDBClient
  RPC: RPC;
  constructor(client) {
    this.client = client;
    this.RPC = new RPC(client)
  }

  async InitAll() {
    await this.RPC.App()
  }
}
