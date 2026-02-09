import { Client, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export const uploadFile = async (file) => {
    try {
        const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID; 

        if (!BUCKET_ID) {
            throw new Error("Missing Appwrite Bucket ID");
        }

        const result = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            file
        );
        
        // Return view URL
        const filePath =  storage.getFileView(BUCKET_ID, result.$id);
        return filePath.href; // Return the string URL
    } catch (error) {
        console.error("Appwrite upload failed:", error);
        throw error;
    }
};
