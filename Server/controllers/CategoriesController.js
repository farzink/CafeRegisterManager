import { error } from "util";

module.exports = app => {
    const repo = app.repositories.sql.CategoryRepository;
    const validator = app.models.viewmodels.category.CategoryValidationViewModel;



    app.route("/categories")
        .all(app.xticate.authenticate())
        .get((req, res) => {
            repo.findAll({}, categories => {
                res.json({
                    categories: categories
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
                        description: req.body.description,
                        code: req.body.code,
                        color: req.body.color
                    }, (result) => {
                        res.status(201).json({ result: result });
                    });
                }
            })






    app.route("/categories/:id")
        .all(app.xticate.authenticate())
        .get((req, res) => {
            let model = req.params
            repo.getById(model, (result) => {
                try {
                    res.json({ category: result })
                } catch (err) {
                    res.json(err.message)
                }
            })
        })
        .put((req, res) => {
            var model = req.body;
            model.id = req.params.id;
            repo.update(model, result => {
                res.status(202).json({ category: result });
            })
        })
        .delete((req, res) => {
            let model = req.params
            repo.delete(model, result => {
                res.json({ success: true });
            })
        })


}