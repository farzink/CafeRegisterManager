module.exports = (sequelize, DataTypes) => {
  const Customers = sequelize.define("Customers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    creditScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  // Customers.associate = (models) => {
  //     Customers.hasMany(models.Items);
  // };

  return Customers;
};
