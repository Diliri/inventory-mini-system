'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';

// Підключаємо CSS для iziToast
import 'izitoast/dist/css/iziToast.min.css';

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

  // Стан для редагування
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState(0);
  const [editPrice, setEditPrice] = useState(0);

  // Хелпер для безпечного виклику iziToast тільки на клієнті
  const showToast = async (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message: string
  ) => {
    const iziToast = (await import('izitoast')).default;
    iziToast[type]({
      title,
      message,
      position: 'topRight',
    });
  };

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/products');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast('error', 'Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity, price }),
      });

      if (!res.ok) throw new Error('Failed to create product');

      setName('');
      setQuantity(0);
      setPrice(0);
      showToast('success', 'Created', 'Product added successfully');
      loadProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      showToast('error', 'Error', 'Failed to add product');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product');

      showToast('info', 'Deleted', 'Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      showToast('error', 'Error', 'Failed to delete product');
    }
  };

  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditQuantity(p.quantity);
    setEditPrice(p.price);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveProduct = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4000/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          quantity: editQuantity,
          price: editPrice,
        }),
      });

      if (!res.ok) throw new Error('Failed to update product');

      setEditingId(null);
      showToast('success', 'Updated', 'Product updated successfully');
      loadProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      showToast('error', 'Error', 'Failed to update product');
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Inventory System</h1>

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
          min="0"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, +e.target.value))}
          required
        />
        <input
          className={styles.input}
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Math.max(0, +e.target.value))}
          required
        />
        <button type="submit" className={styles.submitBtn}>
          Add Product
        </button>
      </form>

      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Loading inventory...</p>
        </div>
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
            {products.map((p) =>
              editingId === p.id ? (
                <tr key={p.id}>
                  <td>
                    <input
                      className={styles.input}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      type="number"
                      min="0"
                      value={editQuantity}
                      onChange={(e) =>
                        setEditQuantity(Math.max(0, +e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      type="number"
                      min="0"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) =>
                        setEditPrice(Math.max(0, +e.target.value))
                      }
                    />
                  </td>
                  <td>{p.status}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.btn}
                      onClick={() => saveProduct(p.id)}
                    >
                      Save
                    </button>
                    <button className={styles.btn} onClick={cancelEditing}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
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
                  <td className={styles.actions}>
                    <button
                      className={styles.btn}
                      onClick={() => startEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.btn}
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}