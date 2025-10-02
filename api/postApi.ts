import { PostData } from "@/types/post";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; 

export async function createPost(post: PostData) {
    try {
        // docRef - document reference
        const docRef = await addDoc(collection(db, "posts"), post);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.log("Error creating post: ", e);
    }
}

// map funksjonen - lage et nytt array basert på et gammelt array
export async function getAllPosts() {
    try {
        const queryResult = await getDocs(collection(db, "posts"));
        // .map returnerer et nytt array basert på det gamle
        const posts = queryResult.docs.map((doc) => ({
            // for hvert dokument skal vi lage et postdata-objekt - skriver over id med ny id
            ...doc.data(),
            id: doc.id
            // as tvinger opbektet til å se ut som PostData, typescript vet ikke mer om hva som er i databasen
        } as PostData));
        console.log("Successfullly fetched posts: ", posts);
        return posts;
    } catch (e) {
        console.log("Error getting posts: ", e);
        // returnerer kun en liste som skal være av typen PostData
        return [] as PostData[];
    }
}

export async function getPostsById(id: string) {
    try {
        const specificPost = await getDoc(doc(db, "posts", id)); // path segments - firebase finner basert på id
        return {
            ...specificPost.data(),
            id: specificPost.id
        } as PostData
    } catch (e) {
        console.log("Error getting document by id: ", e);
        return null;
    }
}