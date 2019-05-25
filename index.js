
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

   

    // User is signed in.
    $(".login-cover").hide();
    $("#loginProgress").hide();
    $("#signInButton").show();
    $("#registerButton").show();

    

    var user = firebase.auth().currentUser;
    
    document.getElementById('loginEmail').value = "";
    document.getElementById('loginPassword').value = "";
    var dialog = document.querySelector('#loginDialog');
                      var registerDialog = document.querySelector('#registerDialog');

                      if (!dialog.showModal) {
                        dialogPolyfill.registerDialog(dialog);

                    }
                    
                    dialog.close();
                    registerDialog.close();


    var userRef = db.collection('partners').doc(user.uid);
    return userRef
      .get()
      .then(doc => {
        if (!doc.exists) {

          /* CHECK IF PARTNER */

          alert("Your account is not a partner account")
          console.log('Partner Document not found');
          firebase.auth().signOut();
          console.log("logged out")
          
            } else {

              console.log("Partner Document found");

              /* CHECK EMAILVERIFIED */

              if(!user.emailVerified){
                console.log ("Email not verified, " + user.emailVerified)
                alert ("Please verify your email and log back in")
                firebase.auth().signOut();
                
                  } else {

                    console.log("Email verified", user.emailVerified)

                    var isVerified =  doc.get("isVerified")
                
                    /* Account verfication check */
                    if(isVerified){

                      console.log("Account is verified",isVerified)
                      
                      setUpData()

                      
                  } else {
                   
                    firebase.auth().signOut();
                    console.log("Account not verified, " + isVerified )
                    alert("Your account is not verified by UglyDeals, please contact support")
                  }

                  }  
              }
      })

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

function setUpData(){

  

  var user = firebase.auth().currentUser
  var userId = user.uid
  var userName = "";
  var userEmail = user.email;
  var userTelephone = ""
  var userLocation = ""
  var userIsFeatured = "";
  var userManagername = "";
  var userManagerTelephone = "";
  var userManagerEmail = "";

  
  $("#submitFileButton").hide();
  
  var userRef = db.collection('partners').doc(user.uid);
  return userRef
    .get()
    .then(doc => {
      if (doc.exists) {
        try{
        userName = doc.get("name")
        userTelephone  = doc.get("telephone")
        userLocation  = doc.get("location")
        userIsFeatured = doc.get("isFeatured").toString()
        userMangerName = doc.get("managerName")
        userMangerTelephone = doc.get("managerTelephone")
        userManagerEmail = doc.get("managerEmail")
 
      }catch(error) {
        console.error("Could not retrieve ", error);}
      }

      $("#partnerName").text(userName)

      
      



      $("#profileName")[0].parentElement.MaterialTextfield.change(userName);
      $("#profileEmail")[0].parentElement.MaterialTextfield.change(userEmail);
      $("#profileTelephone")[0].parentElement.MaterialTextfield.change(userTelephone);
      $("#profileLocation")[0].parentElement.MaterialTextfield.change(userLocation);
      $("#profileFeatured")[0].parentElement.MaterialTextfield.change(userIsFeatured);
      $("#profileManagerName")[0].parentElement.MaterialTextfield.change(userMangerName);
      $("#profileManagerTelephone")[0].parentElement.MaterialTextfield.change(userMangerTelephone);
      $("#profileManagerEmail")[0].parentElement.MaterialTextfield.change(userManagerEmail);

      var btn = document.getElementById('profileSaveButton'); 
      btn.disabled = false; 



       const realFileButton = document.getElementById("profileLogo");
       const customButton = document.getElementById("chooseFileButton");
       const customText = document.getElementById("fileText");

       customButton.addEventListener("click",function(){
         realFileButton.click();
       });

       realFileButton.addEventListener("change", function(){
          if(realFileButton.value){
            customText.innerHTML = realFileButton.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
          } else {
            customText.innterHTML = "No file chosen yet";
          }
       });


      



    
      
})}

$("#profileSaveButton").click(
  function(){
    var user = firebase.auth().currentUser
    var userName = $("#profileName").val();
    //var userId = user.uid
    var userEmail = $("#profileEmail").val();
    var userTelephone = $("#profileTelephone").val();
    var userLocation = $("#profileLocation").val();
    var userManagerName = $("#profileManagerName").val();
    var userManagerTelephone = $("#profileManagerTelephone").val();
    var userManagerEmail = $("#profileManagerEmail").val();


  
  var userRef = db.collection('partners').doc(user.uid);
  return userRef
    .get()
    .then(doc => {
      if (doc.exists) {

      
      userRef.update(
      {
        name : userName,
        telephone : userTelephone,
        email : userEmail,
        location : userLocation,
        managerName : userManagerName,
        managerTelephone : userManagerTelephone,
        managerEmail : userManagerEmail
      }

        ).then(function() 
        {
        alert("Changes have been saved")
        console.log("Document successfully written!");
        }).catch(function(error) {
            console.error("Error writing document: ", error);
    });

  
   
    }
 }) });



 $("#profileLogo").on("change", function(event){

  $("#submitFileButton").show();

 });

 $("#submitFileButton").click(function (){
   uploadFile();
 });

 function uploadFile(){
    // Create a root reference
    var storageRef = firebase.storage().ref();
    var userId = firebase.auth().currentUser.uid;

    var file = document.querySelector('#profileLogo').files[0];
    var fileName  = userId + "_" +file.name;
    var metadata = { contentType: file.type };

    console.log(fileName);

    var task = storageRef.child(fileName).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => console.log("Upload Complete_" + url))
 }











  







  


