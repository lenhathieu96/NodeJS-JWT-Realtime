const jwt = require('jsonwebtoken')
const Secrect = require('../Key')
const User = require('../Models/userModel')
module.exports.createToken = (user) => {
    const token = jwt.sign(
        {
            userID: user._id
        },
        Secrect.Key,
        {
            expiresIn: "1m"
        }
    )
    return token
}

module.exports.createRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        {
            userID: user._id
        },
        Secrect.refreshKey + user.password,
        {
            expiresIn: "1d"
        }
    )
    return refreshToken
}
module.exports.refreshTokens =  (refreshToken) => {
    return new Promise((resolve,reject)=>{
        let _userID = -1
    try {
        const { userID } = jwt.decode(refreshToken)

        _userID = userID
        console.log(_userID, "this is userID")
    } catch (err) {
        reject()
    }
    if (!_userID) {
        reject()
    }
    //search trên database để xác định user và lấy password user đó về
    User.findOne({ _id: _userID }, (err, user) => {
        if (err) {
            reject()
        }
        //Không tìm thấy user
        if (!user) {
            reject()
        }
        //tạo key Refresh
        let fullrefreshKey = Secrect.refreshKey + user.password
        //xác minh refreshToken
        jwt.verify(refreshToken, fullrefreshKey, (err, payload) => {
            //sai token
            if (err) {
                console.log('Wrong token')
                reject()
            }
            const newToken = this.createToken(user)
            resolve(newToken)
        })
    })
    })
    //giải mã refreshToken để lấy userID
    

    // const refreshSecrect = refreshKey+User.password

    // try{
    //     jwt.verify(refreshToken,refreshSecrect)
    // }catch(err){
    //     return{}
    // }

}