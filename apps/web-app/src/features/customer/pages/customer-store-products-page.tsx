import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useCart } from "../../cart/cart-store";
import { useTrackEvent } from "../../analytics/hooks/use-track-event";

export function CustomerStoreProductsPage() {
    const { storeId } = useParams();
    const { addItem } = useCart();
    const trackEvent = useTrackEvent();
    const trackedStoreId = useRef<string | null>(null);
    const trackedProductIds = useRef<Set<string>>(new Set());

    const store = useQuery(
        api.stores.queries.getById,
        storeId ? { storeId: storeId as Id<"stores"> } : "skip"
    );

    const products = useQuery(
        api.products.queries.listPublicByStore,
        storeId ? { storeId: storeId as Id<"stores"> } : "skip"
    );

    useEffect(() => {
        if (!store) {
            return;
        }

        if (trackedStoreId.current === store._id) {
            return;
        }

        trackedStoreId.current = store._id;
        void trackEvent("store_viewed", "store", store._id);
    }, [store, trackEvent]);

    useEffect(() => {
        if (!products) {
            return;
        }

        for (const product of products) {
            if (trackedProductIds.current.has(product._id)) {
                continue;
            }

            trackedProductIds.current.add(product._id);
            void trackEvent("product_viewed", "product", product._id);
        }
    }, [products, trackEvent]);

    if (!storeId) {
        return <div>Missing store.</div>;
    }

    if (store === undefined || products === undefined) {
        return <div>Loading products...</div>;
    }

    if (!store) {
        return <div>Store not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-white p-5">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <p className="mt-1 text-gray-600">{store.description}</p>
                <p className="mt-2 text-sm text-gray-500">{store.address}</p>
            </div>

            <div>
                <h2 className="mb-4 text-2xl font-bold">Products</h2>

                {products.length === 0 && (
                    <div className="rounded border bg-white p-5 text-gray-600">
                        No products available yet.
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="rounded-xl border bg-white p-5 shadow-sm"
                        >
                            {product.imageUrls[0] && (
                                <img
                                    src={product.imageUrls[0]}
                                    alt={product.name}
                                    className="mb-4 h-40 w-full rounded object-cover"
                                />
                            )}

                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                {product.description}
                            </p>

                            <div className="mt-4 font-bold">
                                {product.price.toFixed(3)} BHD
                            </div>

                            <button
                                className="mt-4 w-full rounded bg-black px-4 py-2 text-white"
                                onClick={() =>
                                    addItem({
                                        productId: product._id,
                                        storeId: product.storeId,
                                        name: product.name,
                                        price: product.price,
                                        imageUrl: product.imageUrls[0],
                                    })
                                }
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}