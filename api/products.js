class Products {
  constructor() {
    this.products = [];
  }

  get = () => {
    return this.products;
  };

  getById = (id) => {
    return this.products.filter((p) => p.id === id);
  };

  save = (product) => {
    this.products.push(product);
  };

  update = (index, product) => {
    this.products[index] = product;
  };

  delete = (index) => {
    const product = this.products[index];
    this.products.splice(index, 1);

    return product;
  };
}

module.exports = new Products();
