import { error } from "util"

module.exports = app => {
    const repo = app.repositories.sql.ItemRepository;
    const validator = app.models.viewmodels.item.ItemValidationViewModel;








    app.route("/items/:id")
        .get((req, res) => {

            let model = req.params
            repo.getById(model, (result) => {
                try {
                    res.json({ item: result })
                } catch (err) {
                    res.json(err.message)
                }
            })
        });

    app.route("/items")
        .all(app.xticate.authenticate())
        .get((req, res) => {
            repo.findAll({}, items => {
                res.json({
                    items: items
                })
            });

        })
        .post(validator.validate(),
            (req, res) => {
                const errors = validator.response(req, res);
                if (errors.result) {
                    errors.response();
                } else {

                    repo.add({
                        name: req.body.name,
                        price: req.body.price,
                        category_id: req.body.category_id,
                        description: req.body.description,
                        code: req.body.code,                        
                    }, (result) => {
                        res.status(201).json({ result: result });
                    });
                }
            })






    app.route("/items/:id")
        .all(app.xticate.authenticate())
        .put((req, res) => {
            var model = req.body;
            model.id = req.params.id;
            repo.update(model, result => {
                res.status(202).json({ item: result });
            })
        })
        .delete((req, res) => {
            let model = req.params
            repo.delete(model, result => {
                res.json({ success: true });
            })
        })

};