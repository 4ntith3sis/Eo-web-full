import config from "../payload.config.mjs";
import { getPayload } from "payload";

const payload = await getPayload({ config });
await payload.db.pool.end();
console.log("Payload schema initialized.");
