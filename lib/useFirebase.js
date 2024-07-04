import { Alert } from "react-native";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "./firebase";

export default useFirebase = (fn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

// Register user
export async function createUser(email, password, username, avatar) {
  try {
    const avatarURL = await upload(avatar.uri, "image");
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
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

// Log Out
export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.msg);
  }
}

//Current User
export async function getCurrentUser(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const user = await getDoc(userRef);
    return user.data();
  } catch (error) {
    throw new Error(error.message);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      upload(form.thumbnail.uri, "image"),
      upload(form.video.uri, "video"),
    ]);

    const newPost = await addDoc(collection(db, "videos"), {
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creator: form.user,
      like: [],
      createdAt: serverTimestamp(),
    });
    const updatedPost = await updateDoc(doc(db, "videos", newPost?.id), {
      videoId: newPost?.id,
    });
    return updatedPost;
  } catch (error) {
    throw new Error(error);
  }
}

//toggleLike
export async function toggleLike(documentId, username, isLiked) {
  try {
    const videoRef = doc(db, "videos", documentId);

    const updatedVideo = await updateDoc(videoRef, {
      like: isLiked ? arrayRemove(username) : arrayUnion(username),
    });

    return updatedVideo;
  } catch (error) {
    throw new Error(error);
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const postSnapshot = await getDocs(collection(db, "videos"));
    const data = [];
    postSnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(user) {
  try {
    const videoRef = collection(db, "videos");
    const q = query(videoRef, where("creator", "==", user));
    const postSnapshot = await getDocs(q);
    const data = [];
    postSnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const postSnapshot = await getDocs(collection(db, "videos"));
    const data = [];
    postSnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    const filteredPosts = data.filter((post) =>
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

const upload = async (uri, type) => {
  const fetchResponse = await fetch(uri);
  const file = await fetchResponse.blob();
  let storageRef;
  if (type === "image") {
    storageRef = ref(storage, `images/${file.name}`);
  } else {
    storageRef = ref(storage, `videos/${file.name}`);
  }
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.abs(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
      },
      (error) => {
        reject("Something went wrong!" + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};