const fs = require('fs');

class Product {
    constructor(key, description, price, clasification, existence, minExistence, maxExistence) {
        this.key = key;
        this.description = description;
        this.price = price;
        this.clasification = clasification;
        this.existence = existence;
        this.minExistence = minExistence;
        this.maxExistence = maxExistence;
    }
}

class Inventory {
    products = [];
    load(file) {
        const fileContent = fs.readFileSync(file, 'utf-8');

        const lines = fileContent.trim().split('\n').slice(1);

        this.products = lines.map(line => {
            const fields = line.split(',');
            return new Product(
                parseInt(fields[0]),         // key
                fields[1],                   // descruotuib
                parseFloat(fields[2]),       // price
                fields[3],                   // clasificación
                parseInt(fields[4]),         // existence
                parseInt(fields[5]),         // minExistence
                parseInt(fields[6])          // maxExistence
            );
        });
        return this;
    }
};


const inventory=(new Inventory()).load('products.csv');

const Reports = {
    productExistenceGreaterThan: (number = 20) => inventory.products.filter(product => product.existence > number).length,

    productExistenceLowerThan: (number = 15) => inventory.products.filter(product => product.existence < number).length,

    productsWithSameClasificationAndGreaterThan: (number = 15.50) => {
        return inventory.products.filter(product => product.price > number)
            .reduce((list, product) => {
                if (!list[product.clasification]) {
                    list[product.clasification] = [];
                }
                list[product.clasification].push(product);
                return list;
            }, {});
    },

    productsBetween: (lowerLimit=20.30,upperLimit=45.00) => inventory.products.filter(product => product.price > lowerLimit && product.price < upperLimit),

    numberOfProductsByClasification: () => inventory.products.reduce((counter, product) => {
        counter[product.clasification] = (counter[product.clasification] || 0) + 1;
        return counter;
    }, {})
};

console.log("1) Número de productos con existencia mayor a 20:", Reports.productExistenceGreaterThan());
console.log("2) Número de productos con existencia menor a 15:", Reports.productExistenceLowerThan());
console.log("3) Lista de productos con la misma clasificación y precio mayor 15.50:", Reports.productsWithSameClasificationAndGreaterThan());
console.log("4) Lista de productos con precio mayor a 20.30 y menor a 45.00:", Reports.productsBetween());
console.log("5) Número de productos agrupados por su clasificación:", Reports.numberOfProductsByClasification());
