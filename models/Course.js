'use strict'

module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER   
        },
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Please enter a title"
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: {
                    msg: "Please enter a description"
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    // belongsTo association between your Course and User models (i.e. a "Course" belongs to a single "User")
    Course.associate = (models) => {
        models.Course.belongsTo(models.User, { foreignKey: "userId" });
    };

    return Course;

};