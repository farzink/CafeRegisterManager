import Sequelize from 'sequelize';
import * as fs from 'fs-extra'
const uuid = require('uuid/v1');

module.exports = app => {



    const Items = app.libs.db.init.models.Items;
    const Categories = app.libs.db.init.models.Categories;

    const op = Sequelize.Op;


    return {
        findAll: (model, result) => {
            Items.findAll({
                    include: [{
                        model: Categories
                    }]
                })
                .then(items => {
                    result(items.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            description: item.description,
                            isAvailable: item.isAvailable,
                            code: item.code,
                            category_id: item.dataValues.Category.dataValues.id,
                            updated: item.updated_at
                        }
                    }))
                })
                .catch(error => {

                });
        },
        add: (model, result) => {
            Items.create(model)
                .then(item => {
                    return result(item);
                });
        },
        search: (model, result) => {
            Products.findAll((model.cid != -1) ? ({
                        where: {
                            categoryId: model.cid,
                            [op.or]: [{
                                    name: {
                                        [op.like]: "%" + model.key + "%"
                                    }
                                },
                                {
                                    description: {
                                        [op.like]: "%" + model.key + "%"
                                    }
                                }
                            ]
                        },
                        limit: model.size
                    }) :
                    ({
                        where: {
                            [op.or]: [{
                                    name: {
                                        [op.like]: "%" + model.key + "%"
                                    }
                                },
                                {
                                    description: {
                                        [op.like]: "%" + model.key + "%"
                                    }
                                }
                            ]
                        },
                        limit: model.size
                    }))
                .then(products => {
                    result(products.map(product => {
                        return {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            condition: product.condiction,
                            description: product.description,
                            categoryId: product.categoryId,
                            available: product.available,
                            nov: product.nov,
                            image: "resources/products/images/default/" + product.id,
                            updated: product.updated_at
                        }
                    }))
                })
                .catch(error => {

                });
        },
        delete: (model, result) => {
            Items.destroy({
                    where: {
                        id: model.id
                    }
                })
                .then(item => {
                    return result(true)
                })
        },
        update: (model, result) => {
            let item = {
                name: model.name,
                price: model.price,
                description: model.description,
                isAvailable: model.isAvailable,
                code: model.code,
                category_id: model.category_id,
                updated: new Date()
            }
            Items.update(item, {
                    where: {
                        id: model.id
                    }
                })
                .then(item => {
                    return result(item)
                })
        },
        getById: (model, result) => {
            Items.findOne({
                where: { id: model.id },
                include: [{
                    model: Categories
                }]
            }).then(item => {
                if (item != null) {
                    result({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        isAvailable: item.isAvailable,
                        code: item.code,
                        category_id: item.dataValues.Category.dataValues.id,
                        updated: item.updated_at
                    })
                } else {
                    result(null);
                }
            })

        }
    };
};