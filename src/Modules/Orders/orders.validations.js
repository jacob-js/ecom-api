const yup = require('yup');

export const orderSchema = yup.object({
    phone: yup.string().required("Le numéro de téléphone est requis").matches(/^[+243]/, "Le numéro de téléphone doit commencé avec +243"),
    country: yup.string().required("Le pays est requis"),
    province: yup.string().required("La province est requise"),
    city: yup.string().required("La ville est requise"),
    address: yup.string().required("L'adresse est requise"),
    products: yup.array().of(yup.object({
        id: yup.string().uuid("Veuillez fournir un uuid valid").required("L'id du produit est requis"),
        quantity: yup.number().required("La quantité est requise"),
        specifications: yup.array().of(yup.object({
            key: yup.string().required("La clé est requise"),
            value: yup.string().required("La valeur est requise")
        }))
    })).required("Les produits sont requis"),
});