import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { icons, images } from "../../constants";
import { common } from "../../constants";
import { createUser } from "../../lib/firebase";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { onAuthStateChanged } from "firebase/auth";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        avatar: result.assets[0],
      });
    }
  };

  const submit = async () => {
    if (
      form.username === "" ||
      form.email === "" ||
      form.password === "" ||
      !form.avatar
    ) {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      await createUser(form.email, form.password, form.username, form.avatar);
      onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
          setIsLogged(true);
          router.replace("/home");
        } else {
          Alert.alert("sign up", "something went wrong");
        }
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            className="w-[115px] h-[34px]"
            transition={500}
            placeholder={common.blurhash}
            contentFit="contain"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to WatchNow
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">Avatar</Text>

            <TouchableOpacity onPress={openPicker}>
              {form.avatar ? (
                <Image
                  source={{ uri: form.avatar.uri }}
                  contentFit="cover"
                  className="w-full h-64 rounded-2xl"
                  placeholder={common.blurhash}
                  transition={500}
                />
              ) : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    contentFit="contain"
                    alt="upload"
                    className="w-5 h-5"
                    placeholder={common.blurhash}
                    transition={500}
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
