// require passport
const passport=require('passport')

const LocalStrategy =require('passport-local').Strategy;


//require Schema
const User=require('../model/schema');

//authentication using passport

passport.use(new LocalStrategy({
    usernameField:'email'
},
function (email,password,done){
    //find user Establish the id 
    User.findOne ({email:email},function (err,user){
        //if error then print err
        if(err){
            console.log('Error in finding user ---> passport');
            return done(err);
        }
        
        if(!user || user.password!=password){
            console.log("invalid Username/passport ")
            return done(null,false)
        }
        return done (null,user);

    })
}

));

// serliatizing the user to decide which key is to kept in the cookies 

passport.serializeUser(function (user,done){
        done(null,user.id)
})

//deserliatiizing the user  from  the key in the cookies 

passport.deserializeUser(function(id,done){
    User.findById(id,function (err,user){
        if(err){
            console.log('Error in finding user--> passport ');
            return done(err);
        }
        return done(null,user);
    })

});

//check if the user is authentication 
 passport.checkAuthentication =function(req,res,next){
    // if the user is signIn in,the pass the request to the next function (controller action )
    if(req.isAuthenticated()){
        return next();

    }

      //if user is not signin 
      return res.redirect('/users/signIn')
 }

 passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){

        //req.user contains signed in user from  the session cookie 
      //  we are just sending this to the local for the view
        res.locals.user=res.user
    }
    next();
 }


module.exports=passport;