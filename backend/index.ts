//Artur@DESKTOP-1TDO851 MINGW64 /d/projects go it/GitHub/inventory-mini-system/backend (main)
//$ npm install -D @types/node @types/express @types/cors

const express = require('express');
import type { Request, Response } from 'express'; // Імпортуємо тільки типи
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Розрахунок статусу
const getStatus = (qty: number) => {
  if (qty === 0) return 'out_of_stock';
  if (qty <= 5) return 'low_stock';
  return 'in_stock';
};

// GET /products
app.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /products
app.post('/products', async (req: Request, res: Response) => {
  const { name, quantity, price } = req.body;

  if (!name || quantity < 0 || price < 0) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        quantity: Number(quantity),
        price: Number(price),
        status: getStatus(Number(quantity)),
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PATCH /products/:id
app.patch('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;

  if (quantity !== undefined && quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  if (price !== undefined && price < 0) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  try {
    const updateData: any = { ...req.body };
    if (quantity !== undefined) {
      updateData.quantity = Number(quantity);
      updateData.status = getStatus(Number(quantity));
    }
    if (price !== undefined) updateData.price = Number(price);

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /products/:id
app.delete('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});