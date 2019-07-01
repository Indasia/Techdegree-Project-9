'use strict'

module.exports = (sequelize, DataTypes) => { 
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Please enter a first name"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Please enter a last name"
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Please enter an email address"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Please enter a password"
                }
            }
        }
    });

    // hasMany association between your User and Course models (i.e. a "User" has many "Courses")
    User.associate = (models) => {
        User.hasMany(models.Course);
    };

    return User;

};