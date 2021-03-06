const bcrypt = require('bcryptjs')

module.exports = {
    encrypt: function(plainPassword){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainPassword, salt);
        return hash;
    },

    compare: function(input, password){
        return bcrypt.compareSync(input, password);
    }
}