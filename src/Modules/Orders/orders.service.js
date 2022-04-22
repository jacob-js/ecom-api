import db from "../../db/models";

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
    }
};

export default new OrdersService;