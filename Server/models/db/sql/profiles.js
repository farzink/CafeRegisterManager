import bcrypt from "bcrypt";

module.exports = (sequelize, DataType) => {
    const Profiles = sequelize.define("Profiles", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataType.STRING,
            allowNull: true
        },
        lastname: {
            type: DataType.STRING,
            allowNull: true,
        },
        password: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataType.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        role: {
            type: DataType.STRING,
            allowNull: false,
        }
    }, {
        hooks: {
            beforeCreate: profile => {
                const salt = bcrypt.genSaltSync();
                profile.password = bcrypt.hashSync(profile.password, salt);
            }
        }
    });
    // Profiles.associate = (models) => {
    //     Profiles.hasMany(models.Products);
    // };
    Profiles.isPassword = (encodedPassword, password) => {
        return bcrypt.compareSync(password, encodedPassword);
    };
    return Profiles;
};