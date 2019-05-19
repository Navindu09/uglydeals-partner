
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

   

    // User is signed in.
    $(".login-cover").hide();
    $("#loginProgress").hide();
    $("#signInButton").show();
    $("#registerButton").show();

    var user = firebase.auth().currentUser;
    

    if(user.EmailVerified == false){

      alert ("Please verify your email and log back in")
      
      firebase.auth().signOut();
      console.log("Email not verfied, logged out")
    } 

   /* var userDoc = db.collection("partners").document(user.uid);

    userDoc.get().then(function(doc) {

      if (doc.exists) {
          console.log("Got user document");
          //if(!userDoc.data.isVerified){
              
           // firebase.auth().signOut();
           //console.log("Account not verfied, logged out")
          }
          
/*
      } else {

          firebase.auth().signOut();
          console.log("No such document!, logged out");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });*/

    


    document.getElementById('loginEmail').value = "";
    document.getElementById('loginPassword').value = "";
    
  var dialog = document.querySelector('#loginDialog');
  var registerDialog = document.querySelector('#registerDialog');

  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  dialog.close();
  registerDialog.close();


  } else {

    $(".login-cover").show();
    
    // No user is signed in.
    var dialog = document.querySelector('#loginDialog');

    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    dialog.showModal();
   
  }
});


$("#signInButton").click(

  function(){
    $("#loginError").hide();
    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();
    
    if(email != "" && password!= ""){
      $("#loginProgress").show();
      $("#signInButton").hide();
      $("#registerButton").hide();
      

      firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error){

        $("#loginError").show().text(error.message);

        $("#loginProgress").hide();
        $("#signInButton").show();
        $("#registerButton").show(); 
      });
    }
  }

);



$("#signOutButton").click(
  function(){
    firebase.auth().signOut().then(function() {
  // Sign-out successful.
}).catch(function(error) {
  alert(error.message)
    });
  }
);

//When Register button is clicked on Sign in dialog
$("#registerButton").click(
  function(){
    var registerDialog = document.querySelector('#registerDialog');
    var loginDialog = document.querySelector('#loginDialog');

    document.getElementById('loginEmail').value = "";
    document.getElementById('loginPassword').value = "";
    $("#loginError").hide();
    

    if (!registerDialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    
    registerDialog.showModal();
  }
);

//When the sign in button clicked on registration dialog
$("#registerSignInButton").click(
  function(){

    var registerDialog = document.querySelector('#registerDialog');
    
    document.getElementById('registerEmail').value = "";
    document.getElementById('registerPassword').value = "";
    document.getElementById('registerConfirmPassword').value = "";
    $("#registerError").hide();

    if (!registerDialog.showModal) {
      dialogPolyfill.registerDialog(registerDialog);
    }
    registerDialog.close();

  }
);

$("#registerRegisterButton").click(
  function(){

    
    var email = $("#registerEmail").val();
    var password = $("#registerPassword").val();
    var confirmPassword = $("#registerConfirmPassword").val();

    if (email != "" && password!= "" && confirmPassword != ""){
      if (password == confirmPassword){

        $("#registerError").hide()
        $("#registerSignInButton").hide();
        $("#registerRegisterButton").hide();
        $("#registerProgress").show();


        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(
          (user)=>{
         // here you can use either the returned user object or       firebase.auth().currentUser. I will use the returned user object
            if(user){

              var user = firebase.auth().currentUser;

              var userId = user.uid;
              var userEmail = user.email;
              //var timeStamp = date.getTime;

              db.collection("partners").doc(userId).set({
              
                id: userId,
                email: userEmail,
                registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
                isFeatured: false,
                isVerified: false
            
            })
            .then(function() {
                console.log("Document successfully written!");

                $("#registerError").hide()
                $("#registerSignInButton").show();
                $("#registerRegisterButton").show();
                $("#registerProgress").hide();

                user.sendEmailVerification().then(function() {
                  console.log ("Email verification sent")
                  alert("Please verify your email and log back in")
                  
                  firebase.auth().signOut().then(function() {
                    console.log("Signed out")
                  }).catch(function(error) {
                    alert(error.message)
                    console.log(error.mesage)
                      });

                }).catch(function(error) {
                  console.log("Verfication email not sent")
                 
                  
                });

            

                document.getElementById('registerEmail').value = "";
                document.getElementById('registerPassword').value = "";
                document.getElementById('registerConfirmPassword').value = "";

            })
            .catch(function(error) {
                console.error("Error writing document: ", error);

                user.delete().then(function() {

                  alert("Something went wrong, please try registering again")
                }).catch(function(error) {
                  alert("Oops, Something went wrong, Please contact UglyDeals for assistance")
                });
            });

            }
        })
        .catch(function(error) {
          
          $("#registerError").show().text(error.message);
          $("#registerSignInButton").show();
          $("#registerRegisterButton").show();
          $("#registerProgress").hide();
        });

      } else {
        $("#registerError").show().text("Password and Confirm Password should match");

        $("#registerSignInButton").show();
        $("#registerRegisterButton").show();
        $("#registerProgress").hide();
      }
    }


  }
);





  

