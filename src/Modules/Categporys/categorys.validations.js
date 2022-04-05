import db from '../../db/models';

const yup = require('yup');

export const categorySchema = yup.object({
    name: yup.string().required('Le nom de la catégorie est requis'),
    typeId: yup.number().required('La catégorie parent est requise'),
    isTop: yup.boolean()
})

export const checkCategoryNameExist = async (req, res, next) => {
    const { name } = req.body;
    const category = await db.Categorys.findOne({ where: { name } });
    if(category){
        return sendResponse(res, 400, "La catégorie existe déjà");
    }
    next();
}

export const checkUpdateCategoryNameExist = async (req, res, next) => {
    const { name } = req.body;
   if(name){
        const category = await db.Categorys.findOne({ where: { name } });
        if(category){
            if(category.id !== req.params.id){
                return sendResponse(res, 400, "La catégorie existe déjà");
            }
        }
   }
    next();
}