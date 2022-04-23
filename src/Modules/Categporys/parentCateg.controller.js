import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";
import { uploadProductImage } from "../../Utils/imageUpload.util";

export default {
    parentCategs: async(req, res) => {
        let parents;
        const {method} = req;
        parents = await db.ProductsTypes.findAll({ include: [{ model: db.Categorys, as: 'Categorys', include: 'SubCategorys' }] });

        if(method === 'GET'){
            return sendResponse(res, 200, null, parents);
        }else if(method === 'POST'){
            const icon = await uploadProductImage(req, 'icon');
            const parent = await db.ProductsTypes.create({ ...req.body, icon });
            return sendResponse(res, 201, "Categorie parent enregistrée", parent);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    },

    parentCategDetail: async(req, res) => {
        let parent;
        const {method} = req;
        try {
            parent = await db.ProductsTypes.findOne({
                where: { pk: req.params.id },
                include: [{ model: db.Categorys, as: 'Categorys', include: 'SubCategorys' }]
            });
        } catch (error) {
            return sendResponse(res, 404, "Categorie parent introuvable");
        }
        if(method === 'GET'){
            return sendResponse(res, 200, null, parent);
        }else if(method === 'DELETE'){
            await parent.destroy();
            return sendResponse(res, 200, "Categorie parent supprimée");
        }else if(method === 'PUT'){
            await parent.update({ ...req.body });
            return sendResponse(res, 200, "Categorie parent modifiée", parent);
        }else{
            return sendResponse(res, 404, "Méthode non supportée");
        }
    }
}