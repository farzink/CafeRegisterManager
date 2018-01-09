module.exports = (sequelize, DataTypes) => {
    const Items = sequelize.define("Items", {
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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });


    Items.associate = (models) => {
        Items.belongsTo(models.Categories)
    };

    return Items;
};