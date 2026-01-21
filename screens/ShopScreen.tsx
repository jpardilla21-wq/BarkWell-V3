import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Image, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useTheme } from "@/hooks/useTheme";
import { useDogs } from "@/contexts/DogContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getProducts, getCategories, Product, Category } from "@/services/api";
import { ShopStackParamList } from "@/navigation/ShopStackNavigator";

type ShopScreenNavigationProp = NativeStackNavigationProp<ShopStackParamList, "Shop">;

export default function ShopScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<ShopScreenNavigationProp>();
  const { selectedDogId } = useDogs();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(selectedCategory, undefined, selectedDogId || undefined),
        getCategories(),
      ]);

      if (productsRes.success) {
        setProducts(productsRes.products);
      }
      if (categoriesRes.success) {
        setCategories([
          { category: "All", count: "" },
          ...categoriesRes.categories,
        ]);
      }
    } catch (error) {
      console.error("Failed to load shop data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedDogId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <Pressable
      style={[
        styles.productCard,
        { backgroundColor: theme.backgroundDefault },
      ]}
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
    >
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ThemedText type="small" style={{ color: theme.textMuted }}>
          {item.category}
        </ThemedText>
        <ThemedText type="body" style={styles.productName} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <View style={styles.priceContainer}>
          <ThemedText type="h4" style={{ color: Colors.light.primary }}>
            {item.average_price}
          </ThemedText>
          <Feather name="plus-circle" size={24} color={Colors.light.primary} />
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="h2">Shop</ThemedText>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.categoryPill,
                selectedCategory === item.category && {
                  backgroundColor: Colors.light.primary,
                },
                selectedCategory !== item.category && {
                  backgroundColor: theme.backgroundSecondary,
                },
              ]}
              onPress={() => setSelectedCategory(item.category)}
            >
              <ThemedText
                type="small"
                style={{
                  color: selectedCategory === item.category ? "#FFFFFF" : theme.text,
                  fontWeight: "600",
                }}
              >
                {item.category}
              </ThemedText>
            </Pressable>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText>No products found.</ThemedText>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.xl * 1.5,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  categoriesList: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm / 2,
    borderRadius: BorderRadius.full,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productsGrid: {
    padding: Spacing.md,
  },
  columnWrapper: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  productCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    maxWidth: "48%",
  },
  productImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  productInfo: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  productName: {
    fontWeight: "600",
    height: 40,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
});
