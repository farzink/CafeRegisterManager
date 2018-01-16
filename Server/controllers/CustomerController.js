import { error } from "util";

module.exports = app => {
  const repo = app.repositories.sql.CustomerRepository;
  const validator = app.models.viewmodels.customer.CustomerValidationViewModel;

  app
    .route("/customers")
    .all(app.xticate.authenticate())
    .get((req, res) => {
      repo.findAll({}, customers => {
        res.json({
          customers: customers
        });
      });
    })
    .post(validator.validate(), (req, res) => {
      const errors = validator.response(req, res);
      if (errors.result) {
        errors.response();
      } else {
        repo.add(
          {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email            
          },
          result => {
            res.status(201).json({ result: result });
          }
        );
      }
    });

  app
    .route("/customers/:id")
    .all(app.xticate.authenticate())
    .get((req, res) => {
      let model = req.params;
      repo.getById(model, result => {
        try {
          res.json({ customer: result });
        } catch (err) {
          res.json(err.message);
        }
      });
    })
    .put((req, res) => {
      var model = req.body;
      model.id = req.params.id;
      repo.update(model, result => {
        res.status(202).json({ customer: result });
      });
    })
    .delete((req, res) => {
      let model = req.params;
      repo.delete(model, result => {
        res.json({ success: true });
      });
    });
};
