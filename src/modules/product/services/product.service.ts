import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly connection: Connection,
    ) { }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const { name, description, price, quantity, category } = createProductDto;

        // Create and save the product with the basic details
        const newProduct = this.productRepository.create({ name });
        const savedProduct = await this.productRepository.save(newProduct);

        // Use the product ID to generate a unique database name
        const dbName = `product_db_${savedProduct.id}`;

        // Create the new database and the associated table
        await this.createProductDatabase(dbName);

        // Update the product with the database name
        savedProduct.dbName = dbName;
        await this.productRepository.save(savedProduct);

        // Save the product details into the newly created database
        await this.saveProductDetails(dbName, createProductDto, savedProduct.id);

        return savedProduct;
    }

    private async createProductDatabase(dbName: string): Promise<void> {
        // Create the new database
        await this.connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);

        // Create a table within the new database
        await this.connection.query(`
            CREATE TABLE IF NOT EXISTS \`${dbName}\`.product_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT,  -- Store the product ID for reference
                name VARCHAR(255),
                description TEXT,
                price DECIMAL(10, 2),
                quantity INT,
                category VARCHAR(255)
            )
        `);
    }

    private async saveProductDetails(dbName: string, details: CreateProductDto, productId: number): Promise<void> {
        const { name, description, price, quantity, category } = details;

        // Insert product details into the product_details table with product_id
        await this.connection.query(`
            INSERT INTO \`${dbName}\`.product_details (product_id, name, description, price, quantity, category)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [productId, name, description, price, quantity, category]);
    }

    async getProductDetails(productId: number): Promise<any> {
        // Fetch the product entry to get the database name
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const dbName = product.dbName;

        // Query the specific database for product details using product_id
        const productDetails = await this.connection.query(`
            SELECT * FROM \`${dbName}\`.product_details WHERE product_id = ?
        `, [productId]);

        if (productDetails.length === 0) {
            throw new NotFoundException(`Product details with ID ${productId} not found in database ${dbName}`);
        }

        return productDetails[0];
    }
}
