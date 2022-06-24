const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define('user', {
    // id: {
    //   type: DataTypes.STRING(5),
    //   allowNull: false,
    //   primaryKey: true
    // },
    password: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    usertype: {
      type: DataTypes.STRING(8),
      allowNull: true,
      defaultValue: "User",
    },
    nickName: {    //2
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    firstName: {       //3
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    lastName: {       //3
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {       //8
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    phone: {      //6
      type: DataTypes.STRING(15),
      AllowNull: true,
    },
    birthdate: {  //4
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    country: {    //7
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    verify: {  //11
      type: DataTypes.BOOLEAN,
    },
  },
    {
      timestamps: true,
      createdAt: true,
      updatedAt: false
    }

  );
}