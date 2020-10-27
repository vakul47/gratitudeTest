import dotenv from "dotenv";
import { registerAs } from "@nestjs/config";

const nodeEnv = process.env.NODE_ENV || 'development';
let path = `.env.${nodeEnv}`;

if (nodeEnv === 'development') {
    path = '.env';
}

dotenv.config({ path });

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
    process.env[envName] = process.env[envName]?.replace(/\\n/g, '\n') || '';
}

export default registerAs('mainConfig', () => ( {} ))
