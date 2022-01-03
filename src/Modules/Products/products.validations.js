import db from '../../db/models';
import { sendResponse } from '../../Utils/helpers';

const yup = require('yup');

export const productSchema = yup.object({
    name: yup.string().required('Le nom du produit est réquis'),
    description: yup.string().required('La description est réquise'),
    categoryId: yup.string().required('La categorie est réquise'),
    price: yup.number().required('Le prix est réquis'),
    currency: yup.string().required('La dévise est réquise'),
    quantity: yup.number().required('La quantité est réquise'),
    quantityMetric: yup.string().required('L\'unité de mesure de la quantité est réquise'),
    specifications: yup.array(yup.object({
        key: yup.string().required("La clé est requise"),
        value: yup.string().required("La valeur est requise")
    })),
    discount: yup.number().min(0.0001, "Entre une valeur supérieure à zèro"),
    isNew: yup.boolean()
})

export const productColorSchema = yup.object({
    name: yup.string().required('Le nom de la couleur est requis'),
    productId: yup.string().uuid("Entrer un uuid valide").required('Le produit est requis')
});

export const productRatingSchema = yup.object({
    value: yup.number().min(1, "Entrer une valeur supérieure à zéro").max(5, "Entrer une valeur inférieure à cinq"),
    comment: yup.string()
});

export const checkProductNameExist = async (req, res, next) => {
    const { name } = req.body;
    const product = await db.Products.findOne({ where: { name } });
    if(product){
        return sendResponse(res, 400, "Le produit existe déjà");
    }
    next();
}

export const checkUpdateProductNameExist = async (req, res, next) => {
    const { name } = req.body;
   if(name){
        const product = await db.Products.findOne({ where: { name } });
        if(product){
            if(product.id !== req.params.id){
                return sendResponse(res, 400, "Le produit existe déjà");
            }
        }
   }
    next();
}

export const checkProductRatingExist = async (req, res, next) => {
    const {productId} = req.params;
    const rating = await db.ProductRatings.findOne({ where: { productId, userId: req.user.id } });
    if(rating){
        return sendResponse(res, 409, "Vous avez déjà noté ce produit");
    }else{
        next();
    }
}