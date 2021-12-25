import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";
import { uploadProductImage } from "../../Utils/imageUpload.util";

const productsController = {
    getProducts: async (req, res) => {
        let data;
        const {limit, offset} = req.query;
        data = await db.Products.findAndCountAll({
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0
        });

        return sendResponse(res, 200, null, data);
    },

    async create(req, res) {
        const cover = await uploadProductImage(req);
        const product = await db.Products.create({ ...req.body, cover });
        return sendResponse(res, 201, "Produit enregistré", product);
    }
}

export default productsController;