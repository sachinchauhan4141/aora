import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import {
  Query,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import upload from "./upload";

const firebaseConfig = {
  apiKey: "AIzaSyCUC3XpYWZ0AhJpLhTt9PqmT02B-d0tzcM",
  authDomain: "watchnow-1592e.firebaseapp.com",
  projectId: "watchnow-1592e",
  storageBucket: "watchnow-1592e.appspot.com",
  messagingSenderId: "368527557108",
  appId: "1:368527557108:web:9553aae1b38a91399c79a1",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage();

// Register user
export async function createUser(email, password, username, avatar) {
  try {
    const avatarURL = await upload(avatar.uri, "image");
    console.log("avatar uploaded", avatarURL);
    const res = await createUserWithEmailAndPassword(auth, email, password);

    if (!res) throw Error;

    await setDoc(doc(db, "users", res?.user?.uid), {
      username: username.trim(),
      email,
      avatar: avatarURL,
      userId: res?.user?.uid,
    });
  } catch (error) {
    let msg = error?.message;
    if (msg.includes("auth/invalid-email")) {
      msg = "invalid email address";
    } else if (msg.includes("auth/email-already-in-use")) {
      msg = "this email is already in use";
    } else if (msg.includes("auth/weak-password")) {
      msg = "Password should be at least 6 characters";
    }
    throw new Error(msg);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const response = await signInWithEmailAndPassword(email, password);

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

// Log Out
export async function logOut() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    throw new Error(error.msg);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      upload(form.thumbnail.uri, "image"),
      upload(form.video.uri, "video"),
    ]);

    const newPost = await setDoc(collection(db, "videos"), {
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creator: form.userId,
      like: [],
      createdAt: serverTimestamp(),
    });

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

//toggleLike
export async function toggleLike(documentId, username) {
  try {
    const videoRef = doc(db, "videos", documentId);

    const updatedVideo = await updateDoc(videoRef, {
      like: video.like.includes(username)
        ? arrayUnion(username)
        : arrayRemove(username),
    });

    return updatedVideo;
  } catch (error) {
    throw new Error(error);
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await getDoc(collection(db, "videos"));
    console.log("all posts",posts.data());
    return posts.data();
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const videoRef = collection(db, "videos");
    const q = query(videoRef, where("creator", "==", userId));
    const postSnapshot = await getDocs(q);
    console.log("user posts", postSnapshot.docs);
    // return postSnapshot.docs;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const res = await getDocs(collection(db, "videos"));
    const allPosts = res.docs;
    const filteredPosts = allPosts.filter((post) =>
      post?.title?.toLowerCase().includes(query.toLowerCase())
    );
    return filteredPosts;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const videoRef = collection(db, "videos");
    const q = query(videoRef, orderBy("createdAt"), limit(5));
    const posts = await getDocs(q);
    return posts.docs;
  } catch (error) {
    throw new Error(error);
  }
}
