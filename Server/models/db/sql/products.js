module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define("Products", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            validate: {
                notEmpty: false
            }
        },
        condition: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
        },
        available: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        nov: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });


    Products.associate = (models) => {


        Products.belongsTo(models.Profiles)
        Products.belongsTo(models.Categories)
    };



    return Products;
};