import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import { common } from "../constants";
import { icons } from "../constants";
import { toggleLike } from "../lib/firebase";
import { useGlobalContext } from "../context/GlobalProvider";

const VideoCard = ({
  id,
  title,
  creator,
  avatar,
  thumbnail,
  video,
  liked,
  setVisible,
}) => {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);

  const handleLiked = async () => {
    await toggleLike(id, user.username);
    setIsLiked(!isLiked);
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              transition={500}
              placeholder={common.blurhash}
              contentFit="contain"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLiked} className="pt-2">
          <Image
            tintColor={isLiked ? "#FFA001" : ""}
            source={icons.like}
            className="w-5 h-5"
            transition={500}
            placeholder={common.blurhash}
            contentFit="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisible(true)} className="pt-2">
          <Image
            source={icons.comment}
            className="w-5 h-5"
            transition={500}
            placeholder={common.blurhash}
            contentFit="contain"
          />
        </TouchableOpacity>
        <View className="pt-2">
          <Image
            source={icons.menu}
            className="w-5 h-5"
            transition={500}
            placeholder={common.blurhash}
            contentFit="contain"
          />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            transition={500}
            placeholder={common.blurhash}
            contentFit="contain"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            transition={500}
            placeholder={common.blurhash}
            contentFit="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
