import { useAuthSession } from "@/providers/authctx";
import { PostData } from "@/types/post";
import { getPostByLocalId, updatePostById } from "@/utils/local-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as postApi from "@/api/postApi";

export default function PostDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userNameSession } = useAuthSession();

  const [post, setPost] = useState<PostData | null>(null);
  const [commentText, setCommentText] = useState("");

  async function fetchPostFromLocal(inputId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const postLocal = await getPostByLocalId(inputId);
    if (postLocal) {
      setPost(postLocal);
    }
  }

  async function fetchPostsFromApi(inputId: string) {
    const post = await postApi.getPostsById(inputId)
    setPost(post);
  }

  useEffect(() => {
    // fetchPostFromLocal(id);
    fetchPostsFromApi(id);
  }, [id]);

  if (post === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Henter innlegg</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Image style={styles.imageStyle} source={{ uri: post.imageUri }} />
      <View style={styles.contentContainer}>
        <Text style={styles.titleStyle}>{post.title}</Text>
        <Text style={[styles.textStyle, { paddingTop: 6 }]}>
          {post.description}
        </Text>
      </View>
      <View style={styles.commentsContainer}>
        <Text style={styles.commentTitle}>Kommentarer</Text>
        <View style={styles.commentsList}>
          <FlatList
            data={post.comments}
            renderItem={(comment) => (
              <View style={styles.commentItem}>
                <Text style={[styles.smallTextStyle, { color: "gray" }]}>
                  {comment.item.author}:
                </Text>
                <Text style={styles.smallTextStyle}>
                  {comment.item.comment}
                </Text>
              </View>
            )}
          />
        </View>
        <View style={styles.addCommentContainer}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            style={styles.commentTextField}
            placeholder="Skriv en kommentar"
          />
          <Pressable
            onPress={() => {
              const postComments = post.comments;
              postComments.push({
                comment: commentText,
                author: userNameSession ?? "Dette skal ikke skje",
              });
              // Dette kalles "object spread operator" og er en metode for å kopiere et object samtidig som man endrer en eller flere av verdiene
              const updatedPost: PostData = {
                ...post,
                comments: postComments,
              };
              // cmd+click for å se hvor funksjonen er definert, den ligger under local-storage.tsx
              updatePostById(id, updatedPost);
              setPost(updatedPost);
              setCommentText("");
            }}
          >
            <Text style={styles.smallTextStyle}>Legg til</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          zoomEnabled={false}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          initialRegion={{
            latitude: post.postCoordinates?.latitude ?? 0,
            longitude: post.postCoordinates?.longitude ?? 0,
            latitudeDelta: 0.0082,
            longitudeDelta: 0.0081,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Marker
            coordinate={{
              latitude: post.postCoordinates?.latitude ?? 0,
              longitude: post.postCoordinates?.longitude ?? 0,
            }}
          >
            <Callout>
              <Text>Hei jeg er en callout</Text>
            </Callout>
          </Marker>
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 18,
  },
  smallTextStyle: {
    fontSize: 16,
  },
  postDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  commentsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 2,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentsList: {
    maxHeight: 140,
    marginTop: 2,
  },
  addCommentContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  commentTextField: {
    borderBottomWidth: 1,
    borderColor: "gray",
    width: "70%",
    fontSize: 16,
  },
  mapContainer: {
    paddingHorizontal: 16,
    width: "100%",
    height: 250,
    marginTop: 16,
  },
});
