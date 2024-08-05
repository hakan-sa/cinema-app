const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Ticket extends Model {
    static async getTicket(id) {
        return await this.findOne({ where: { id } });
    }
}

Ticket.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Movie',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Booking',
            key: 'id'
        }
    },
    showroom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Showroom',
            key: 'id'
        }
    },
    show_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    show_time_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ShowTime',
            key: 'id'
        }
    },
    seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Seat',
            key: 'id'
        }
    },
    ticket_prices_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TicketPrice',
            key: 'id'
        }
    },
    show_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Show',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
    timestamps: false
});

module.exports = Ticket;
