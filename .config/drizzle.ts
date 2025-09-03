import {defineConfig} from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
    dialect: "sqlite",
    schema: "./server/database/schema.ts",
    out: "./server/database/migrations",
    breakpoints: false,
    casing: "snake_case",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
})
