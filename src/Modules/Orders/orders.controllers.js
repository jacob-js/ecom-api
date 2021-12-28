const db = require("../../db/models");
const { sendResponse } = require("../../Utils/helpers");

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
            const order = await db.Orders.create({ ...req.body, status: 'pending', userId: req.user.id });
            const orderItems = await Promise.all(products.map(async (product) => {
                const { id, quantity, specifications } = product;
                const orderItem = await db.OrderItems.create({
                    productId: id,
                    quantity,
                    specifications,
                    orderId: order.id
                });
                return orderItem;
            }));
            console.log(orderItems);
            return sendResponse(res, 201, "Votre commande a été envoyée", order);
        }else{
            return sendResponse(res, 405, "Methode non supportée", null);
        }

    }
};

export default ordersController;