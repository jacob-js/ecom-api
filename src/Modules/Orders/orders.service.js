import db from "../../db/models";
import { Op } from 'sequelize';

class OrdersService{
    model = db.Orders;

    async getAll(limit, offset){
        return await this.model.findAndCountAll({
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            order: [['createdAt', 'DESC']],
            include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
        });
    };

    async getByStatus(status, limit, offset){
        return await this.model.findAndCountAll({
            where: {
                status: status
            },
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            order: [['createdAt', 'DESC']],
            include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
        });
    };

    async getByUserId(userId, limit, offset){
        return await this.model.findAndCountAll({
            where: {
                userId
            },
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            order: [['createdAt', 'DESC']],
            include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
        })
    };

    async getUsersOrdersByStatus(userId, status, offset, limit){
        return await this.model.findAndCountAll({
            where: {
                userId, status
            },
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            order: [['createdAt', 'DESC']],
            include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
        })
    };

    async getOrdersByDateInterval(startDate, endDate){
        const orders = await this.model.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['createdAt', 'DESC']],
            include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
        });
        const loopItems = new Promise((resolve, reject) =>{
            let items = [];
            orders.forEach(async (order, index) =>{
                items = [ ...items, ...order.Items];
                if(index === orders.length - 1) resolve(items);
            })
        });
        return loopItems.then(items =>{
            const cdfItems = items.filter(item => item.currency?.toLowerCase() === 'cdf');
            const usdItems = items.filter(item => item.currency?.toLowerCase() === 'usd');
            const totalCdf = cdfItems.reduce((acc, item) => acc + (item.unitAmount * item.quantity), 0);
            const totalUsd = usdItems.reduce((acc, item) => acc + (item.unitAmount * item.quantity), 0);
            return { orders, totalCdf, totalUsd };
        });
    };

    async getOrdersSum(){
        const orders = await this.model.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: db.OrderItems, as: 'Items', include: 'Product' }, { model: db.Users, as: 'User' }]
        });
        const loopItems = new Promise((resolve, reject) =>{
            let items = [];
            orders.forEach(async (order, index) =>{
                items = [ ...items, ...order.Items];
                if(index === orders.length - 1) resolve(items);
            })
        });
        return loopItems.then(items =>{
            const cdfItems = items.filter(item => item.currency?.toLowerCase() === 'cdf');
            const usdItems = items.filter(item => item.currency?.toLowerCase() === 'usd');
            const totalCdf = cdfItems.reduce((acc, item) => acc + (item.unitAmount * item.quantity), 0);
            const totalUsd = usdItems.reduce((acc, item) => acc + (item.unitAmount * item.quantity), 0);
            return { totalCdf, totalUsd };
        });
    }
};

export default new OrdersService;