const User=require('../model/schema')

module.exports.signIn=function(req,res){
     // check is user is already login so dont go signUp page 
     if(req.isAuthenticated()){
       return  res.redirect('/users/home')
    }
    return res.render('signIn');
}
module.exports.signUp=function(req,res){
   
    // check is user is already login so dont go signUp page 
    if(req.isAuthenticated()){
      return res.redirect('/users/home')
    }
    return res.render('signUp');
}

module.exports.home=function(req,res){
    return res.render('home');
}



// get the sign-up 

module.exports.create=function(req,res){
    //first check password is not equal

    if(req.body.password!=req.body.confirmPassword){
        return res.redirect('back');

    }
    //find user
    User.findOne({email:req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/signIn');
            })
        }else{
            return res.redirect('back');
        }

    });
}

//get the sign-in and create a session for the user
 
module.exports.createSession=function (req,res){
    // step to authentication 
    //find the user
    return res.redirect('/users/home')
}

module.exports.destroySession = function(req, res){
    //logout session 
    req.logout(function(err) {
      if (err) {
        console.log(err);
        return res.redirect('/');
      }
      return res.redirect('/users/signIn');
    });
  };
  
  


