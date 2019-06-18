'use strict'

module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    //   userId: {
    //   how to do this one?    
    //   },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
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

    return Course;
};