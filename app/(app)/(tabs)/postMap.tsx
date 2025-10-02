import { View, Text, StyleSheet } from "react-native";
import { PostData } from "@/types/post";
import { useState, useEffect } from "react";
import { getData } from "@/utils/local-storage";
import MapView, { Marker, Callout } from "react-native-maps";


export default function PostMap() {
    const [posts, setPosts] = useState<PostData[]>([]);

    async function getPosts() {
        const existingPosts = await getData("postStore");
        if (existingPosts) {
            setPosts(existingPosts ? JSON.parse(existingPosts) : []);
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <View style={styles.mainContainer}>
            
                <MapView 
                    initialRegion={{
                    latitude: 59.906096,
                    longitude: 10.73767,
                    latitudeDelta: 0.0082,
                    longitudeDelta: 0.0081,
                    }}
                    style={styles.map}>
                    {posts.map((post) => (
                        <Marker
                            key={post.id}
                            coordinate={{
                                latitude: post.postCoordinates?.latitude ?? 0,
                                longitude: post.postCoordinates?.longitude ?? 0,
                            }}
                            title={post.title}
                        />
                    ))}
                </MapView>
            <Callout>
              <Text>
                Tap on the markers to see post titles.
              </Text>
            </Callout>
        </View>
    )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  map: {
    flex: 1, 
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,   
  }
});