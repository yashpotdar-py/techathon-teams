import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://admin:admin@techathon-teams.euwqn.mongodb.net/?retryWrites=true&w=majority&appName=techathon-teams";

let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    console.log("Connected to database");
  }
  return client.db("techathon-teams");
}

// export async function getAdminCollection() {
//   const db = await connectToDatabase();
//   return db.collection("admins");
// }
