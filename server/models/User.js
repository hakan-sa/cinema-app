const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { hash } = require('bcrypt');
const saltRounds = 8;

class User extends Model {

    static async isEmailTaken(email) {
        const user = await this.findOne({ where: { email } });
        return !!user;
    }

    static async createUser(userData) {
        return await this.create(userData);
    }

    static async updateUser(id, userData) {
        return await this.update(userData, { where: { id } });
    }

    static async deleteUser(id) {
        return await this.destroy({ where: { id } });
    }

    static async hashPassword(password) {
        return await hash(password, saltRounds);
    }

}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    clearance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clearance',
            key: 'id'
        }
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UserStatus',
            key: 'id'
        }
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_promo_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'EmailPromoStatus',
            key: 'id'
        }
    },
    avatar_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verification_code: {
        type: DataTypes.STRING(6),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await User.hashPassword(user.password);
            }
        }
    }
});

module.exports = User;