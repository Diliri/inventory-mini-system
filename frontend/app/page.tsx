'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  status: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // Окремий функціонал для завантаження продуктів
  const loadProducts = async () => {
    try {
      const res = await fetch('http://localhost:4000/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Виклики оновлення після першого рендеру
    const timer = setTimeout(() => {
      loadProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, price }),
      });
      setName('');
      setQuantity(0);
      setPrice(0);
      loadProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/products/${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Inventory System</h1>

      <form onSubmit={addProduct} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>${p.price}</td>
                <td
                  className={
                    p.status === 'in_stock'
                      ? styles.badgeInStock
                      : p.status === 'low_stock'
                      ? styles.badgeLowStock
                      : styles.badgeOutOfStock
                  }
                >
                  {p.status}
                </td>
                <td>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}