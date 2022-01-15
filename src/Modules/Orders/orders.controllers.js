import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";

const ordersController = {
    async orders(req, res) {
        const { method } = req;
        const { limit, offset } = req.query;
        const { userId } = req.params;
        let orders;
        if(method === 'GET') {
            if(userId){
                orders = await db.Orders.findAndCountAll({
                    where: {
                        userId
                    },
                    limit: parseInt(limit) || 10,
                    offset: parseInt(offset) || 0,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
                });
            }else{
                orders = await db.Orders.findAndCountAll({
                    limit: parseInt(limit) || 10,
                    offset: parseInt(offset) || 0,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
                });
            }
            return sendResponse(res, 200, null, orders);
        }else if(method === 'POST') {
            const { products } = req.body;
            let items = [];
            const ref = Math.random().toString(36).substring(2, 9);
            const order = await db.Orders.create({ ...req.body, status: 'pending', userId: req.user.id, ref });
            new Promise( (resolve, reject) =>{
                products.forEach(async (product, index) => {
                    const { id, quantity, specifications } = product;
                    const prod = await db.Products.findOne({ where: { id } });
                    const orderItem = await db.OrderItems.create({
                        productId: id,
                        quantity,
                        specifications,
                        orderId: order.id,
                        unitAmount: prod.price - (parseFloat(prod.discount || 0)),
                        currency: prod.currency
                    });
                    const newQuantity = prod.quantity - orderItem.quantity;
                    await db.Products.update({ quantity: newQuantity }, { where: { id } });
                    items.push(orderItem);
                    if(index === products.length - 1) resolve(orderItem);
                });
            }).then(orderItems =>{
                return sendResponse(res, 201, "Votre commande a été envoyée", {order, items})
            });     
        }else{
            return sendResponse(res, 405, "Methode non supportée", null);
        }

    },

    async orderDetails(req, res) {
        const { method } = req;
        const { orderId } = req.params;
        if(method === 'GET') {
            const order = await db.Orders.findOne({ where: { id: orderId }, include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }] });
            return sendResponse(res, 200, null, order);
        }else{
            return sendResponse(res, 405, "Methode non supportée", null);
        }
    }
};

export default ordersController;