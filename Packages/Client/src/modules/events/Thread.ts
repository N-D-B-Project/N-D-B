import { Injectable } from "@nestjs/common";
import { Context, ContextOf, On } from "necord";

@Injectable()
export class ThreadEvents {
  @On("threadCreate")
  public async onThreadCreate(
    @Context() [thread, newlyCreated]: ContextOf<"threadCreate">
  ) {
    if (thread.joinable && newlyCreated) {
      await thread.join();
    }
  }

  @On("threadDelete")
  public async onThreadDelete(@Context() [thread]: ContextOf<"threadDelete">) {}
}
