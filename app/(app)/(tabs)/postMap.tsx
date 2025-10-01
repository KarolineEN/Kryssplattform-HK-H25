import { View } from "react-native";
import { PostData } from "@/types/post";
import { useState, useEffect } from "react";
import { getData } from "@/utils/local-storage";
import MapView, { Marker } from "react-native-maps";


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
        <View>
            <MapView>
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
        </View>
    )
}