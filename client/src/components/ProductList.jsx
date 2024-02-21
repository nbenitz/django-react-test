import { useEffect, useState } from "react";
import { getAllProducts } from '../api/product.api';
import { ProductCard } from './ProductCard';

export function ProductList({ isApproved }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadProducts() {
      console.log(searchQuery);
      const res = await getAllProducts({ search: searchQuery });
      setProducts(res.data);
    }
    loadProducts();
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-end pt-4">
        <input
          type="text"
          className="bg-zinc-700 p-3 rounded-lg block mb-3"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {products.map(product => (
          <ProductCard key={product.id} product={product} isApproved={isApproved} />
        ))}
      </div>
    </div>
  );
}
