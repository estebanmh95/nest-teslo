import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/products.seed';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}
  async runSeed() {
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];
    products.map(async (product) => {
      const insertPromise = this.productsService.create(product);
      insertPromises.push(insertPromise);
    });

    await Promise.all(insertPromises);

    return true;
  }
}
