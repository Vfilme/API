const express = require('express');
const app = express();
const fs = require('fs').promises; // Используем fs.promises для асинхронного чтения
const path = require('path');

const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Функция для асинхронного чтения файла с товарами
async function readProductsFromFile() {
    try {
        const data = await fs.readFile(productsFilePath, 'utf8');
        return JSON.parse(data).products;
    } catch (err) {
        console.error('Ошибка при чтении файла с товарами:', err);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

// Эндпоинт для получения карточек товаров с пагинацией и фильтрацией
app.get('/api/products', async (req, res) => {
    try {
        const productsData = await readProductsFromFile();
        let pageSize = parseInt(req.query.pageSize) || 10;
        let page = parseInt(req.query.page) || 1;

        // Применение пагинации
        let startIndex = (page - 1) * pageSize;
        let endIndex = startIndex + pageSize;
        let paginatedProducts = productsData.slice(startIndex, endIndex);

        res.json({ products: paginatedProducts });
    } catch (err) {
        console.error('Ошибка при обработке запроса на /api/products:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
