import { uploadProductImage } from "../../Utils/imageUpload.util";
import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";

const categorysController = {
    async categorys(req, res) {
        let categorys;
        const {method} = req;
        const {isTop} = req.query;
        if(isTop){
            categorys = await db.Categorys.findAll({
                where: { isTop: true }
            });
        }else{ categorys = await db.Categorys.findAll(); }
        if(method === 'GET'){
            return sendResponse(res, 200, null, categorys);
        }else if(method === 'POST'){
            let cover;
            if(req.files?.cover){
                cover = await uploadProductImage(req, 'cover');
            }
            if(req.body.isTop && !cover){
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
                where: { id: req.params.id }
            });
        } catch (error) {
            return sendResponse(res, 404, "Categorie introuvable");
        }
        if(method === 'GET'){
            return sendResponse(res, 200, null, category);
        }else if(method === 'DELETE'){
            await category.destroy();
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
        const category = await db.Categorys.findOne({
            where: { name: categoryName }
        });
        if(category){
            const products = await db.Products.findAndCountAll({
                where: { categoryId: category.id },
                limit: parseInt(limit) || 10,
                offset: parseInt(offset) || 0,
                include: [ 'Colors', 'Ratings' ],
            });
            return sendResponse(res, 200, null, products);
        }else{
            return sendResponse(res, 200, { count: 0, rows: [] });
        }
    }
};

export default categorysController;