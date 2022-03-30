import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";

const subCategoryController = {
    subCategs: async(req, res) => {
        let subs;
        const {method} = req;
        subs = await db.SubCategorys.findAll({ include: 'Category' });

        if(method === 'GET'){
            return sendResponse(res, 200, null, subs);
        }else if(method === 'POST'){
            const sub = await db.ProductsTypes.create({ ...req.body, cover });
            return sendResponse(res, 201, "Sous-categorie enregistrée", sub);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    },

    subCategDetail: async(req, res) => {
        let sub;
        const {method} = req;
        try {
            sub = await db.SubCategorys.findOne({
                where: { id: req.params.id },
                include: 'Category'
            });
        } catch (error) {
            return sendResponse(res, 404, "Sous-categorie introuvable");
        }
        if(method === 'GET'){
            return sendResponse(res, 200, null, sub);
        }else if(method === 'DELETE'){
            await sub.destroy();
            return sendResponse(res, 200, "Sous-categorie supprimée");
        }else if(method === 'PUT'){
            await sub.update({ ...req.body });
            return sendResponse(res, 200, "Sous-categorie sub modifiée", sub);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    }
};

export default subCategoryController;