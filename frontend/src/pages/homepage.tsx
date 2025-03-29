import PageTemplate from "@/pages/pageTemplate";
import ItemGrid from "@/components/itemgrid";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite"
import productStore from "@/store/productStore";

const HomePage = observer(() => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (productStore.products.length === 0) {
      setLoading(true);
      productStore.getProducts()
      setLoading(false);
    }
  }, []);
  
  return (
    <PageTemplate>
      <div className="p-4">
        <ItemGrid loading={loading} cards={productStore.products} />
      </div>
    </PageTemplate>
  );
})

export default HomePage;