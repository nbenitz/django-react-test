import { useEffect, useState } from "react"
import { getAllProducts } from '../api/product.api'
import { ProductCard } from './ProductCard'


export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const res = await getAllProducts();
      setProducts(res.data);
      console.log(res);
    }
    loadProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}  