import { View, Text, FlatList } from "react-native";
import Modal from "react-native-modal";
import CommentInput from "./CommentInput";

const CommentModal = ({ isVisible, setVisible }) => {
  // Sample data for FlatList (replace with your actual data)
  const comments = [
    {
      id:1,
      text:"kya krr rha h"
    },
    {
      id:2,
      text:"kya krr rha h"
    },
    {
      id:3,
      text:"kya krr rha h"
    },
    {
      id:4,
      text:"kya krr rha h"
    },
    {
      id:5,
      text:"kya krr rha h"
    },
    {
      id:6,
      text:"kya krr rha h"
    },
  ];

  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={"down"}
      onSwipeComplete={() => setVisible(false)}
      style={{
        margin: 0,
      }}
      className="flex-row items-end"
    >
      <View className="bg-primary h-2/3 rounded-t-3xl w-full">
        <View className="py-4 mb-2 justify-center items-center border-b-[1px] border-gray-800">
          <Text className="text-white text-xl font-pmedium">Comments</Text>
        </View>
        <FlatList
          data={comments}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <View className="py-4 mb-2">
              <Text className="text-white text-xl font-pmedium">
                {item?.text}
              </Text>
            </View>
          )}
          className="px-3"
        />
        <View className="justify-center p-3 mb-3 items-center border-t-[1px] border-gray-800">
          <CommentInput />
        </View>
      </View>
    </Modal>
  );
};

export default CommentModal;
