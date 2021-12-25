const yup = require('yup');

export const productSchema = yup.object({
    name: yup.string().required('Le nom du produit est réquis'),
    description: yup.string().required('La description est réquise'),
    categoryId: yup.string().required('La categorie est réquise'),
    price: yup.number().required('Le prix est réquis'),
    currency: yup.string().required('La dévise est réquise'),
    quantity: yup.number().required('La quantité est réquise'),
    quantityMetric: yup.number().required('L\'unité de mesure de la quantité est réquise'),
    specifications: yup.array(yup.object()),
    discount: yup.number().min(0.0001, "Entre une valeur supérieur à zèro"),
    isNew: yup.boolean()
})