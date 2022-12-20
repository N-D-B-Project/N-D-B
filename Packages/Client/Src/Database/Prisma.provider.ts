import { Logger } from "@/Utils/Tools"
import { PrismaClient } from "@prisma/client"

export default class PrismaProvider extends PrismaClient {
  private isConnected: boolean = false
  private logger: Logger = new Logger()
  constructor() {
    super()
  }

  isDatabaseConnected() {
    return this.isConnected
  }

  setStatus(Connection: boolean) {
    this.isConnected = Connection
  }

  async Connect(): Promise<void> {
    try {
      await this.$connect()
      this.setStatus(true)
      this.logger.database("PostgreSQL connected via Prisma")
    } catch (error) {
      this.logger.error(String(error))
    }
  }

  async Disconnect(): Promise<void> {
    try {
      await this.$disconnect()
      this.setStatus(false)
      this.logger.database("PostgreSQL disconnected via Prisma")
    } catch (error) {
      this.logger.error(String(error))
    }
  }
}
