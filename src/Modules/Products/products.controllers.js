import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";
import { uploadProductImage } from "../../Utils/imageUpload.util";
import { Op } from 'sequelize';

const productsController = {
    getProducts: async (req, res) => {
        let data;
        const {limit, offset, isBest, bigDiscount} = req.query;
        if(isBest) {
            data = await db.Products.findAndCountAll({
                where: {
                    deletedAt: null
                },
                limit: limit,
                offset: offset,
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: ['Colors', 'Ratings', 'Category'],
                order: [['sales', 'DESC']]
            });
        } else if(bigDiscount) {
            data = await db.Products.findAndCountAll({
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: ['Colors', 'Ratings', 'Category'],
                order: [['discount', 'DESC']],
                where: {
                    discount: {[Op.gt]: 0},
                    deletedAt: null
                }
            });
        }else {
            data = await db.Products.findAndCountAll({
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: ['Colors', 'Ratings', 'Category'],
                order: [['name', 'DESC']],
                where: { deletedAt: null }
            });
        }
        

        return sendResponse(res, 200, null, data);
    },

    async create(req, res) {
        const specs = req.body.specifications;
        const specifications = JSON.parse(specs);
        const sizes = JSON.parse(req.body.sizes) || [];
        const cover = await uploadProductImage(req, 'cover');
        const product = await db.Products.create({ ...req.body, cover, specifications, sizes });
        return sendResponse(res, 201, "Produit enregistré", product);
    },

    async createProductColor(req, res) {
        try {
            const image = await uploadProductImage(req, 'image');
            const productColor = await db.ProductColors.create({ ...req.body, image });
            return sendResponse(res, 201, "Couleur enregistrée", productColor);
        } catch (error) {
            return sendResponse(res, 400, "Une image est requise");
        }
    },

    async deleteProdColor(req, res) {
        try {
            const productColor = await db.ProductColors.findByPk(req.params.id);
            if(!productColor) {
                return sendResponse(res, 404, "Couleur introuvable");
            }
            await productColor.destroy();
            return sendResponse(res, 200, "Couleur supprimée");
        } catch (error) {
            return sendResponse(res, 500, "Une erreur est survenue");
        }
    },
    
    async productDetail(req, res) {
        let product;
        const {method} = req;
        try {
            product = await db.Products.findOne({
                where: { id: req.params.id, deletedAt: null },
                include: [ 'Colors', 'Category', 'Ratings' ]
            });
            if(!product){
                return sendResponse(res, 404, "Produit introuvable");
            }
        } catch (error) {
            return sendResponse(res, 404, "Produit introuvable");
        }
        if(method === 'GET'){
            return sendResponse(res, 200, null, product);
        }else if(method === 'DELETE'){
            await product.update({ deletedAt: new Date() });
            return sendResponse(res, 200, "Produit supprimé");
        }else if(method === 'PUT'){
            let cover;
            if(req.files?.cover){
                cover = await uploadProductImage(req, 'cover');
            };
            const specs = req.body.specifications;
            const specifications = JSON.parse(specs);
            const sizes = JSON.parse(req.body.sizes) || [];
            await product.update({
                ...req.body, cover: cover || product.cover,
                specifications: specifications || product.specifications, sizes: sizes || product.sizes
            });
            return sendResponse(res, 200, "Produit modifié", product);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    },

    async productRatings(req, res) {
        const {method} = req;
        if(method === 'GET'){
            const ratings = await db.ProductRatings.findAll({
                where: { productId: req.params.productId },
                include: 'User',
                order: [['createdAt', 'DESC']]
            });
            const medium = ratings.reduce((acc, cur) => acc + cur.value, 0) / ratings.length;
            return sendResponse(res, 200, null, { ratings, medium });
        }else if(method === 'POST'){
            const rating = await db.ProductRatings.create({ ...req.body, productId: req.params.productId, userId: req.user.id });
            return sendResponse(res, 201, "Note enregistrée", rating);
        }else if(method === 'DELETE'){
            await db.ProductRatings.destroy({
                where: {
                    productId: req.params.productId,
                    userId: req.user.id
                }
            });
            return sendResponse(res, 200, "Note supprimée");
        }else if(method === 'PUT'){
            await db.ProductRatings.update({ ...req.body }, {
                where: {
                    productId: req.params.productId,
                    userId: req.user.id
                }
            });
            return sendResponse(res, 200, "Note modifiée");
        }
        else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    },

    async searchProducts(req, res) {
        const {query, limit, offset, categoryId} = req.query;
        let products;
        console.log(categoryId);
        if(limit && offset){
            if(categoryId && categoryId != 'undefined' && categoryId != 'null'){
                products = await db.Products.findAndCountAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${query}%`
                        },
                        categoryId: categoryId,
                        deletedAt: null
                    },
                    limit: parseInt(limit) || 10,
                    offset: parseInt(offset) || 0,
                    include: ['Colors', 'Ratings', 'Category'],
                    order: [['createdAt', 'DESC']]
                });
            }else {
                products = await db.Products.findAndCountAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${query}%`
                        },
                        deletedAt: null
                    },
                    limit: parseInt(limit) || 10,
                    offset: parseInt(offset) || 0,
                    include: ['Colors', 'Ratings', 'Category'],
                    order: [['createdAt', 'DESC']]
                })
            }
        }else{
            if(categoryId && categoryId != 'undefined' && categoryId != 'null'){
                products = await db.Products.findAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${query}%`
                        },
                        categoryId: categoryId,
                        deletedAt: null
                    },
                    include: ['Colors', 'Ratings', 'Category'],
                    order: [['createdAt', 'DESC']]
                });
            }else {
                products = await db.Products.findAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${query}%`
                        },
                        deletedAt: null
                    },
                    include: ['Colors', 'Ratings', 'Category'],
                    order: [['createdAt', 'DESC']]
                });
            }
        }
        return sendResponse(res, 200, null, products);
    },

    async suggestedProducts(req, res) {
        const {limit, offset} = req.query;
        const { method } = req;
        const products = await db.SuggestedProducts.findAndCountAll({
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            include: 'User'
        });
        if(method === 'GET'){
            return sendResponse(res, 200, null, products);
        }else if(method === 'POST'){
            const cover = await uploadProductImage(req, 'cover');
            const suggestedProduct = await db.SuggestedProducts.create({ ...req.body, userId: req.user.id, cover });
            return sendResponse(res, 201, "Produit suggéré à BWETETA", suggestedProduct);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    },

    async suggestedProductDetail(req, res) {
        const {method} = req;
        let suggestedProduct;
        try {
            suggestedProduct = await db.SuggestedProducts.findOne({
                where: { id: req.params.id },
                include: 'User'
            });
        } catch (error) {
            return sendResponse(res, 404, "Produit introuvable");
        }
        if(method === 'GET'){
            return sendResponse(res, 200, null, suggestedProduct);
        }else if(method === 'DELETE'){
            await suggestedProduct.destroy();
            return sendResponse(res, 200, "Produit suggéré supprimé");
        }else if(method === 'PUT'){
            const cover = await uploadProductImage(req, 'cover');
            await suggestedProduct.update({ ...req.body, cover: cover || suggestedProduct.cover });
            return sendResponse(res, 200, "Produit suggéré modifié", suggestedProduct);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    }
}

export default productsController;