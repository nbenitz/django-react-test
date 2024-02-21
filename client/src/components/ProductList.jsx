import { useEffect, useState } from "react"
import { getAllProducts } from '../api/product.api'
import { ProductCard } from './ProductCard'


export function ProductList({ isApproved }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const res = await getAllProducts();
      setProducts(res.data);
    }
    loadProducts();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map(product => (
        <ProductCard key={product.id} product={product} isApproved={isApproved} />
      ))}
    </div>
  );
}  