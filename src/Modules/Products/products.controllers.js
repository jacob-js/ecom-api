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
                    isBest: true
                },
                limit: limit,
                offset: offset,
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: ['Colors', 'Ratings', 'Category'],
                order: [['createdAt', 'DESC']]
            });
        } else if(bigDiscount) {
            data = await db.Products.findAndCountAll({
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: ['Colors', 'Ratings', 'Category'],
                order: [['discount', 'DESC']],
                where: {
                    discount: {[Op.gt]: 0}
                }
            });
        }else {
            data = await db.Products.findAndCountAll({
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: ['Colors', 'Ratings', 'Category'],
                order: [['createdAt', 'DESC']]
            });
        }
        

        return sendResponse(res, 200, null, data);
    },

    async create(req, res) {
        const cover = await uploadProductImage(req, 'cover');
        const product = await db.Products.create({ ...req.body, cover });
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
    
    async productDetail(req, res) {
        let product;
        const {method} = req;
        try {
            product = await db.Products.findOne({
                where: { id: req.params.id },
                include: [ 'Colors', 'Category', 'Ratings' ]
            });
        } catch (error) {
            return sendResponse(res, 404, "Produit introuvable");
        }
        if(method === 'GET'){
            return sendResponse(res, 200, null, product);
        }else if(method === 'DELETE'){
            await product.destroy();
            return sendResponse(res, 200, "Produit supprimé");
        }else if(method === 'PUT'){
            let cover;
            if(req.files?.cover){
                cover = await uploadProductImage(req, 'cover');
            }
            await product.update({ ...req.body, cover: cover || product.cover });
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
                        categoryId: categoryId
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
                        }
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
                        categoryId: categoryId
                    },
                    include: ['Colors', 'Ratings', 'Category'],
                    order: [['createdAt', 'DESC']]
                });
            }else {
                products = await db.Products.findAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${query}%`
                        }
                    },
                    include: ['Colors', 'Ratings', 'Category'],
                    order: [['createdAt', 'DESC']]
                });
            }
        }
        return sendResponse(res, 200, null, products);
    }
}

export default productsController;