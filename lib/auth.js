import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Reuse one Mongo client across hot reloads / serverless invocations
const globalForMongo = globalThis;
if (!globalForMongo._studiospaceMongo) {
  globalForMongo._studiospaceMongo = new MongoClient(process.env.MONGODB_URI);
}
const client = globalForMongo._studiospaceMongo;
const db = client.db("studiospace");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    // After registering, the user is sent to the Login page (see requirements).
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
