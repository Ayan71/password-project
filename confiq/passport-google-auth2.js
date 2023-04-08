const passport=require('passport')

const googleStrategy=require('passport-google-oauth').OAuth2Strategy;

const crypto=require('crypto')

const User=require('../model/schema')


//tell passport to use new Strategy for google login 
passport.use(new googleStrategy({
    clientID:"450112913502-oekute3965i44s7gm4um196agf4v9ea9.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"https://localhost:1000/users/auth/google/callback"
    },

    function (accessToken,refreshToken,profile,done){
        //find the user
        User.findOne({email:profile.emails[0].value}).exec(function (err,user){
            if(err){console.log('error in google strategy-passport',err);return;}
           
             
            console.log(profile);
            if(user){
                //fins the user if found set this user as req.user
                return done (null,user);

            }
            else{
                //if not found ,create the user ans set it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },   function (err,user){

                    //is error then print error
                    if(err){console.log('error in google strategy-passport',err);return;}

                    return done(null,user);

                }
                )
            }
        })
    }
))
//export the passport 
module.exports=passport;