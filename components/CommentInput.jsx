import { useState } from "react";
import { View, TouchableOpacity, TextInput, Alert } from "react-native";
import { Image } from "expo-image";

import { common } from "../constants";
import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";

const CommentInput = ({ initialQuery }) => {
  const { user } = useGlobalContext();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-14 px-2 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <View className="rounded-full overflow-hidden">
        <Image
          source={user?.avatar}
          className="w-9 h-9"
          transition={500}
          placeholder={common.blurhash}
          contentFit="contain"
        />
      </View>
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Add a comment"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search"
            );
        }}
      >
        <Image
          source={icons.send}
          className="w-7 h-7"
          transition={500}
          placeholder={common.blurhash}
          contentFit="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CommentInput;
