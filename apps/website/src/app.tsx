import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebsiteLayout } from "./components/website-layout";
import { HomePage } from "./pages/home-page";
import { StoresPage } from "./pages/stores-page";
import { CategoriesPage } from "./pages/categories-page";
import { StoreDetailPage } from "./pages/store-detail-page";
import { CategoryDetailPage } from "./pages/category-detail-page";
import { SearchPage } from "./pages/search-page";
export default function App() {
  return (
    <BrowserRouter>
      <WebsiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/:storeId" element={<StoreDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:categoryId" element={<CategoryDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </WebsiteLayout>
    </BrowserRouter>
  );
}