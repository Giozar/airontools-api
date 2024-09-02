// import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

export async function removeProductSpecification(
  specificationId: string | Types.ObjectId,
  productModel,
) {
  // Step 1: Find all products that contain the specification to be deleted
  const products = await productModel.find({
    'specifications.specification': specificationId,
  });

  // Log the products before modification
  //   console.log(
  //     'Products before removing specification:',
  //     JSON.stringify(products, null, 2),
  //   );

  // if (products.length === 0) {
  //   throw new NotFoundException(
  //     `No products found with the specification ID ${specificationId}`,
  //   );
  // }

  // Step 2: Update each product by removing the specification and filtering out those with empty values
  await Promise.all(
    products.map(async (product) => {
      product.specifications = product.specifications.filter(
        (spec) =>
          spec.specification.toString() !== specificationId &&
          spec.value.trim() !== '',
      );

      // Log the product after modification, before saving
      //   console.log(
      //     'Product after removing specification and filtering empty values:',
      //     JSON.stringify(product, null, 2),
      //   );

      await product.save();
    }),
  );

  // Optional: Log the products after saving to see final state
  const updatedProducts = await productModel.find({
    'specifications.specification': specificationId,
  });

  return updatedProducts;

  //   console.log(
  //     'Products after saving:',
  //     JSON.stringify(updatedProducts, null, 2),
  //   );
}
