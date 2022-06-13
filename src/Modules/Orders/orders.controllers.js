import db from "../../db/models";
import { sendResponse } from "../../Utils/helpers";
import { Op } from "sequelize";
import OrdersService from "./orders.service";

const ordersController = {
    async orders(req, res) {
        const { method } = req;
        const { limit, offset, status, startDate, endDate, userId } = req.query;
        const { ordersId } = req.params;
        let orders;
        if(method === 'GET') {
            if(userId && status){
                orders = await OrdersService.getUsersOrdersByStatus(userId, status, offset, limit);
            }
            if(userId){
                orders = await OrdersService.getByUserId(userId, limit, offset);
            }else if(status){
                orders = await OrdersService.getByStatus(status, limit, offset)
            }else if(startDate && endDate){
                orders = await OrdersService.getOrdersByDateInterval(startDate, endDate);
            }else{
                orders = await OrdersService.getAll(limit, offset);
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
        }else if(method === 'PUT'){
            const { status } = req.body;
            const ids = ordersId.split(',');
            const orders = await db.Orders.update({ status }, { where: { id: { [Op.in]: ids } } });
            if(status === 'delivered'){
                orders.forEach(async order =>{
                    const items = await db.OrderItems.findAll({ where: { orderId: order.id } });
                    items.forEach(async item =>{
                        const prod = await db.Products.findOne({ where: { id: item.productId } })
                        if(prod){
                            const quantity = prod.quantity - item.quantity
                            const sales = prod.sales + item.quantity
                            await prod.update({ quantity, sales })
                        }
                    })
                })
            }
            return sendResponse(res, 200, "Opération effectuée avec succès", orders);
        }else{
            return sendResponse(res, 405, "Methode non supportée", null);
        }

    },

    async ordersSum(req, res) {
        const orders = await OrdersService.getOrdersSum();
        return sendResponse(res, 200, null, orders);
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