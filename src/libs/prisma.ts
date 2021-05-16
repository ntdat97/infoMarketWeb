import { PrismaClient } from "@prisma/client";
// declare global {
//   var prisma: PrismaClient;
// }
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}
declare const global: CustomNodeJsGlobal;
const prisma = global.prisma || new PrismaClient();
// check to use this workaround only in development and not in production
if (process.env.NODE_ENV === "development") global.prisma = prisma;
export default prisma;
