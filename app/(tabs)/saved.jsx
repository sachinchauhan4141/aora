import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, RefreshControl, Text, View } from "react-native";

import useFirebase, { getAllPosts } from "../../lib/useFirebase";
import { EmptyState, SearchInput, VideoCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import CommentModal from "../../components/CommentModal";

const Saved = () => {
  const { data: posts, refetch } = useFirebase(getAllPosts);
  const { user } = useGlobalContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts.filter((post) => post.like.includes(user?.username))}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            id={item.videoId}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator?.username}
            avatar={item.creator?.avatar}
            liked={item.like.includes(user?.username)}
            setVisible={setModalVisible}
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
      <CommentModal isVisible={modalVisible} setVisible={setModalVisible} />
    </SafeAreaView>
  );
};

export default Saved;
