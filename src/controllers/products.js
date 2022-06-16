const { v4: uuidv4, validate } = require("uuid");
const { Op } = require("sequelize");
const { Product, Category, User, Review } = require("../db.js");





// La consulta para productos debe ser:
// Para pedir por ID: localhost:3001/product/:id
// Para pedir por nombre: localhost:3001/product/name?name=producto
// Para pedir catalogo completo: localhost:3001/product/all

async function getProduct(req, res, next) {
    const { idProduct } = req.params;
    const { name } = req.query;
    console.log('ID ', idProduct);
    console.log('NOMBRE ', name);
    if (validate(idProduct)) {
        try {
            if (idProduct) {
                const product = await Product.findByPk(idProduct, {
                    include: [{ model: Category }, { model: User }, { model: Review }]
                });
                const { id, name, description, image, ranking, createBy, price, stock, categories, users, reviews } = product;
                const response = {
                    id,
                    name,
                    description,
                    image,
                    ranking,
                    createBy,
                    price,
                    stock,
                    categories: categories.map(category => category.name),
                    reviews: reviews.map(review => {
                        return {
                            description: review.description,
                            ranking: review.ranking,
                            userId: review.userId,
                            nickName: users.filter(user => user.id === review.userId)[0].nickName
                        }
                    }
                    )
                }
                res.json(response);
            } else {
                res.send("idProduct is required");
            }
        } catch (error) {
            next(error);
        }
    } else {
        if (name) {
            const searchDbNames = await Product.findAll({
                where: {
                    name: { [Op.iLike]: `%${name}%` },
                },
                include: Category,
            });
            let finalProduct = searchDbNames.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    ranking: product.ranking,
                    createdBy: product.createdBy,
                    price: product.price,
                    stock: product.stock,
                    categories: product.categories.map(category => category.name),
                }
            });
            res.status(200).json(finalProduct);
        } else {
            const getProduct = await Product.findAll({
                include: Category,
            });
            let finalProduct = getProduct.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    ranking: product.ranking,
                    createdBy: product.createdBy,
                    price: product.price,
                    stock: product.stock,
                    categories: product.categories.map(category => category.name),
                }
            });
            res.status(200).json(finalProduct);
        }
    }
};



async function getProdByCategory(req, res) {
    const { category } = req.params;
    const products = await Product.findAll();
    try {
        const productByCategory =
            products.filter((p) => {
                const productFilter = p;
                categoryFilter = productFilter.category
                if (categoryFilter.includes(category)) return productFilter;
            })
        res.json(productByCategory)
    } catch (error) {
        res.send(error)
    }
}




//________________________________________________________________//
//para hacer post de un producto
// hacer la llamada a localhost:3001/product
// enviar el body de la siguiente forma:
// {
//     "name":"Nuevo Producto 11",
//     "description":"Descripcion producto 11",
//     "image":"imagen producto 1",
//     "ranking":"10",
//     "createBy":"Mariano",
//     "price":"202",
//     "categories":["2","3"],
//     "stock":"10"
//   }




async function createProduct(req, res, next) {
    let { name, description, image, ranking, createBy, price, categories, stock } = req.body;
    const searchDbNames = await Product.findOne({
        where: {
            name: { [Op.iLike]: `%${name}%` },
        },
        include: Category,
    });
    

    if (!searchDbNames) {

        try {
            const productCreated = await Product.create({
                // where: {
                id: uuidv4(),
                name,
                description,
                image,
                ranking,
                createBy,
                price,
                stock
                // }
            })
            await productCreated.addCategories(categories);

            res.status(201).send('Creado Exitosamente');


        } catch (error) {
            // res.send(error)
            console.log('ERROR :', error.message);
        }
    } else {
        res.status(304).send('Error de creacion');
    }

    // res.send('Created succesfully, saludos desde el BACK!!')
};

// async function updateProduct(req, res) {
//     const { idProduct } = req.params;
//     const { name, description, image, ranking, createBy, price, categories, stock } = req.body;
//     let updateProduct = await Product.findOne({
//         where: {
//             id: idProduct,
//         },
//         include: Category,
//     })
//     console.log('updateProduct', updateProduct);
//     categoria = updateProduct.categories[0].id;
//     console.log('CATEGORIA', categoria);
//     console.log('CATEGORIA', categories);
//     await updateProduct.update({
//         name,
//         description,
//         image,
//         ranking,
//         createBy,
//         price,
//         stock

//     })
//     if (categories!=null) {
//         console.log('categories', categories.length);
//         await updateProduct.setCategories(categories);
//     }
    
//     res.send('Producto modificado ');
// }

async function updateProduct(req, res) {
    const { idProduct } = req.params;
    const { name, description, image, ranking, createBy, price, categories, stock } = req.body;
    
    if(categories.length > 0){       
        let updateProduct = await Product.findOne({
            where: {
                id: idProduct,
            }
        })
        await updateProduct.update({
            name,
            description,
            image,
            ranking,
            createBy,
            price,
            stock

        })
        await updateProduct.setCategories(categories)
        res.send('Producto modificado ');
    }else{
        Product.update(req.body,{where:{id:req.params.idProduct}})
        .then(()=>res.send('Actualizado Exitosamente'))
        .catch(error=> console.log(`Error en Actualizacion: ${error}`))
    }
    
}

async function deleteProduct(req, res) {
    const { idProduct } = req.params;
    await Product.destroy({
        where: { id: idProduct },
        include: Category,
    })
    res.status(200).send('Producto borrado');

}




module.exports = {
    getProduct,
    getProdByCategory,
    createProduct,
    updateProduct,
    deleteProduct
};
//-----------------------------------------------------------
//  ESTE CODIGO ES DE RESPALDO Y PRUEBAS - NO TOCAR
//-----------------------------------------------------------
