import { uploadProductImage } from "../../Utils/imageUpload.util";
import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";
import { Op } from "sequelize";

const categorysController = {
    async categorys(req, res) {
        let categorys;
        const {method} = req;
        const {isTop} = req.query;
        if(isTop){
            categorys = await db.Categorys.findAll({
                where: { isTop: true },
                include: ['ParentCateg', 'SubCategorys']
            });
        }else{ categorys = await db.Categorys.findAll({ include: ['ParentCateg', 'SubCategorys'] }); }
        if(method === 'GET'){
            return sendResponse(res, 200, null, categorys);
        }else if(method === 'POST'){
            let cover;
            const isTop = JSON.parse(req.body.isTop);
            if(req.files?.cover){
                cover = await uploadProductImage(req, 'cover');
            }
            if(isTop && !cover){
                return sendResponse(res, 400, "Une image est requise");
            }
            const category = await db.Categorys.create({ ...req.body, cover });
            return sendResponse(res, 201, "Categorie enregistrée", category);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    },

    async categoryDetail(req, res) {
        let category;
        const {method} = req;
        try {
            category = await db.Categorys.findOne({
                where: { pk: req.params.id },
                include: ['ParentCateg', 'SubCategorys']
            });
            if(!category) return sendResponse(res, 404, "Categorie introuvable");
        } catch (error) {
            return sendResponse(res, 404, "Categorie introuvable");
        }
        if(method === 'GET'){
            return sendResponse(res, 200, null, category);
        }else if(method === 'DELETE'){
            await category.destroy({ cascade: true });
            return sendResponse(res, 200, "Categorie supprimée");
        }else if(method === 'PUT'){
            let cover;
            if(req.files?.cover){
                cover = await uploadProductImage(req, 'cover');
            }
            await category.update({ ...req.body, cover: cover || category.cover });
            return sendResponse(res, 200, "Categorie modifiée", category);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    },

    async getProductsByCategory(req, res){
        const { categoryName } = req.params;
        const { limit, offset } = req.query;
        let categorys = [];
        const categsArray = categoryName.split(',');
        new Promise((resolve, reject) => {
            categsArray.forEach(async (name, index) => {
                const parentCateg = await db.ProductsTypes.findOne({
                    where: { name: name },
                    include: [{ model: db.Categorys, as: 'Categorys', include: 'SubCategorys' }]
                });
                const category = await db.Categorys.findOne({
                    where: { name },
                    include: ['SubCategorys']
                });
                if(parentCateg){
                    categorys.push(parentCateg);
                }else if(category){
                    categorys = categorys.concat(category.SubCategorys).concat([category]);
                }else{
                    const subCateg = await db.SubCategorys.findOne({
                        where: { name }
                    });
                    if(subCateg){
                        categorys.push(subCateg);
                    }
                }
                if(index === (categsArray.length - 1)){
                    resolve(categorys);
                }
            });
        }).then(async() => {
            const allCats = categorys.reduce((acc, curr) => acc.concat(curr).concat(curr?.Categorys || []), []);
            const allSubCats = allCats.reduce((acc, curr) => acc.concat(curr?.SubCategorys || []), []);
            const allCategs = allCats.concat(allSubCats);
            const products = await db.Products.findAndCountAll({
                where: { categoryId: {[ Op.or ]: [ allCategs.map(category => category.pk) ]} },
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: [ 'Colors', 'Ratings' ]
            });
            return sendResponse(res, 200, null, products);
        }).catch(() => {
            return sendResponse(res, 500, "Something went wrong");
        });          
    }
};

export default categorysController;