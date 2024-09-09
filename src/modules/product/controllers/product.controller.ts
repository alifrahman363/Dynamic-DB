import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/create-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('create')
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productService.createProduct(createProductDto);
    }

    @Get(':id')
    async getProductDetails(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getProductDetails(id);
    }
}
