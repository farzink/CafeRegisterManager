module.exports = app => {
    const Customers = app.libs.db.init.models.Customers;
    return {
      findAll: (model, result) => {
        Customers.findAll({})
          .then(customers => {
            result(customers);
          })
          .catch(error => {
            //less fart more art
          });
      },
      add: (model, result) => {
        Customers.create(model).then(customer => {
          return result(customer);
        });
      },
      add: (model, result) => {
        Customers.create(model).then(customer => {
          return result(customer);
        });
      },
      getById: (model, result) => {
        Customers.findOne({
          where: {
            id: model.id
          }
        }).then(customer => {
          if (customer != null) {
            result(customer);
          } else {
            result(null);
          }
        });
      },
      update: (model, result) => {
        let customer = {
          name: model.name,
          phone: model.phone,
          email: model.email,
          creditScore: model.creditScore,
          updated: new Date()
        };
        Customers.update(customer, {
          where: {
            id: model.id
          }
        }).then(nor => {
          if (nor >= 1) {
            Customers.findOne({
              where: {
                id: model.id
              }
            }).then(customer => {
              if (customer != null) {
                result(customer);
              } else {
                result(null);
              }
            });
          }
        });
      },
      delete: (model, result) => {
        Customers.destroy({
          where: {
            id: model.id
          }
        }).then(customer => {
          return result(true);
        });
      }
    };
  };
  