import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";

import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { EmptyState, SearchInput, VideoCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Saved = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { user } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    Alert.alert("Refetched all liked videos");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts.filter((post) => post.like.includes(user?.username))}
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
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <Text className="text-2xl font-psemibold text-white mb-3">
              Saved Videos
            </Text>
            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Saved;
