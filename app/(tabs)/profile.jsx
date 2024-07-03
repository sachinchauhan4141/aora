import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { common } from "../../constants";
import { icons } from "../../constants";
import useFirebase from "../../lib/useFirebase";
import { getUserPosts, logOut } from "../../lib/firebase";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox, VideoCard } from "../../components";
import { useState } from "react";
import CommentModal from "../../components/CommentModal";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const posts = [];
  const { data } = useFirebase(() => getUserPosts(user.$id));
  console.log("user posts",data);

  const [modalVisible, setModalVisible] = useState(false);

  const logout = async () => {
    await logOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            id={item.$id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator?.username}
            avatar={item.creator?.avatar}
            liked={item.like.includes(user?.username)}
            setVisible={setModalVisible}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                className="w-6 h-6"
                transition={500}
                placeholder={common.blurhash}
                contentFit="contain"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                transition={500}
                placeholder={common.blurhash}
                contentFit="contain"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
      />
      <CommentModal isVisible={modalVisible} setVisible={setModalVisible} />
    </SafeAreaView>
  );
};

export default Profile;
