import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
  categoryUsesCircularProductTypeFilters,
  collectCategoryBrands,
  extractBrandFromProductName,
  getBrandImageMapFromProducts,
  getCategoryGenders,
  getCategoryProductTypes,
  getProductTypeImageMapFromProducts,
  mergeCategoryBrandTileImages,
  matchesGender,
  matchesProductType,
} from "@my-bahrain/utils";
import { BrandFilterRow } from "../components/brand-filter-chips";
import { ProductTypeFilterRow } from "../components/product-type-filter-row";
import { CartButton } from "../components/customer-home-header";
import { CustomerSearchInput } from "../components/customer-search-input";
import { BackButton } from "../components/page-header";
import { ProductCard } from "../components/product-card";
import { useCart } from "../../cart/cart-store";

function GenderChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold transition ${
        active
          ? "bg-[#FF5A00] text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white"
        >
          <div className="aspect-square bg-gray-100" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-2/3 rounded bg-gray-100" />
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-4 w-1/2 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryProductsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const category = useQuery(
    api.categories.queries.getById,
    categoryId ? { categoryId: categoryId as Id<"categories"> } : "skip",
  );

  const genders = useMemo(
    () => getCategoryGenders(category?.slug),
    [category?.slug],
  );

  const activeGender = selectedGender ?? genders[0] ?? null;

  const productTypes = useMemo(
    () => getCategoryProductTypes(category?.slug),
    [category?.slug],
  );

  const activeProductType = selectedProductType ?? productTypes[0] ?? null;
  const usesCircularProductTypes = categoryUsesCircularProductTypeFilters(category?.slug);

  const products = useQuery(
    api.products.queries.listPublicProducts,
    categoryId ? { categoryId: categoryId as Id<"categories">, limit: 120 } : "skip",
  );

  const brands = useMemo(
    () =>
      collectCategoryBrands(
        category?.slug,
        (products ?? []).map((product) => product.name),
      ),
    [products, category?.slug],
  );

  const brandImages = useMemo(
    () =>
      mergeCategoryBrandTileImages(
        category?.slug,
        getBrandImageMapFromProducts(
          (products ?? []).map((product) => ({
            name: product.name,
            imageUrl: product.imageUrls[0],
          })),
        ),
      ),
    [products, category?.slug],
  );

  const productTypeImages = useMemo(
    () =>
      mergeCategoryBrandTileImages(
        category?.slug,
        getProductTypeImageMapFromProducts(products ?? [], productTypes),
      ),
    [products, productTypes, category?.slug],
  );

  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      if (activeGender && !matchesGender(product, activeGender)) {
        return false;
      }

      if (activeProductType && !matchesProductType(product, activeProductType)) {
        return false;
      }

      if (selectedBrand && extractBrandFromProductName(product.name) !== selectedBrand) {
        return false;
      }

      if (query && !product.name.toLowerCase().includes(query)) {
        return false;
      }

      return true;
    });
  }, [products, selectedBrand, activeGender, activeProductType, search]);

  if (!categoryId) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        Missing category.
      </div>
    );
  }

  if (category === undefined || products === undefined) {
    return (
      <div className="pb-6">
        <div className="bg-white px-4 pb-3 pt-3">
          <div className="flex items-center gap-2">
            <BackButton
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-gray-700 transition hover:text-gray-900"
            />
            <div className="min-w-0 flex-1">
              <CustomerSearchInput value="" onChange={() => undefined} placeholder="Search" />
            </div>
            <CartButton />
          </div>
        </div>
        <ProductListSkeleton />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-4 px-4 py-8 text-center">
        <p className="text-gray-600">Category not found.</p>
        <Link to="/customer" className="font-semibold text-[#FF5A00]">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="bg-white px-4 pb-3 pt-3">
        <div className="flex items-center gap-2">
          <BackButton
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-gray-700 transition hover:text-gray-900"
          />
          <div className="min-w-0 flex-1">
            <CustomerSearchInput
              value={search}
              onChange={setSearch}
              placeholder={category.name}
            />
          </div>
          <CartButton />
        </div>
      </div>

      {genders.length > 0 ? (
        <div className="border-b border-gray-100 bg-white px-4 pb-3">
          <div className="flex gap-2">
            {genders.map((gender) => (
              <GenderChip
                key={gender}
                label={`${gender}'s ${category.name}`}
                active={activeGender === gender}
                onClick={() => setSelectedGender(gender)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {productTypes.length > 0 && activeProductType && usesCircularProductTypes ? (
        <BrandFilterRow
          brands={productTypes}
          brandImages={productTypeImages}
          selectedBrand={activeProductType}
          onSelect={(type) => type && setSelectedProductType(type)}
          showAll={false}
          layout="grid"
        />
      ) : productTypes.length > 0 && activeProductType ? (
        <ProductTypeFilterRow
          types={productTypes}
          selectedType={activeProductType}
          onSelect={setSelectedProductType}
        />
      ) : (
        <BrandFilterRow
          brands={brands}
          brandImages={brandImages}
          selectedBrand={selectedBrand}
          onSelect={setSelectedBrand}
          bakedTiles={category.slug === "watches"}
        />
      )}

      {products.length === 0 ? (
        <div className="mx-4 mt-4 rounded-2xl border border-dashed border-gray-200 bg-brand-surface px-6 py-10 text-center">
          <p className="text-4xl">⌚</p>
          <p className="mt-3 font-semibold text-gray-900">No products yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Check back soon — new items are added regularly.
          </p>
          <Link
            to="/customer/products"
            className="mt-4 inline-block text-sm font-bold text-[#FF5A00]"
          >
            Browse all products
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mx-4 mt-4 rounded-2xl border border-dashed border-gray-200 bg-brand-surface px-6 py-10 text-center">
          <p className="font-semibold text-gray-900">No matching products</p>
          <p className="mt-1 text-sm text-gray-500">Try another filter or clear your search.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedBrand(null);
              setSelectedGender(null);
              setSelectedProductType(null);
              setSearch("");
            }}
            className="mt-4 text-sm font-bold text-[#FF5A00]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 px-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              variant="grid"
              productId={product._id}
              name={product.name}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              imageUrl={product.imageUrls[0]}
              onAddToCart={() =>
                addItem({
                  productId: product._id,
                  storeId: product.storeId,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrls[0],
                })
              }
            />
          ))}
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="px-4 pt-5">
          <Link
            to="/customer/products"
            className="block rounded-2xl border border-gray-200 bg-white py-3 text-center text-sm font-bold text-gray-900 transition hover:border-orange-200 hover:bg-orange-50"
          >
            Browse all products
          </Link>
        </div>
      ) : null}
    </div>
  );
}
