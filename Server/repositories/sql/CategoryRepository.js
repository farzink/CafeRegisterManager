module.exports = app => {
    const Categories = app.libs.db.init.models.Categories;
    return {
        findAll: (model, result) => {
            Categories.findAll({})
                .then(categories => {
                    result(categories)
                })
                .catch(error => {
                    //less fart more art
                });
        },
        add: (model, result) => {
            Categories.create(model)
                .then(category => {
                    return result(category);
                });
        },
        add: (model, result) => {
            Categories.create(model)
                .then(category => {
                    return result(category);
                });
        },
        getById: (model, result) => {
            Categories.findOne({
                where: {
                    id: model.id
                }
            }).then(category => {
                if (category != null) {
                    result(category)
                } else {
                    result(null);
                }
            })

        },
        update: (model, result) => {
            let category = {
                name: model.name,
                description: model.description,
                code: model.code,
                color: model.color,
                updated: new Date()
            }
            Categories.update(category, {
                    where: {
                        id: model.id
                    }
                })
                .then(category => {
                    return result(category)
                })
        },
        delete: (model, result) => {
            Categories.destroy({
                    where: {
                        id: model.id
                    }
                })
                .then(category => {
                    return result(true)
                })
        }
    };
};