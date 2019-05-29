
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

///////////////////////////
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


///////////////////////////
$("#signOutButton").click(
  function(){
    firebase.auth().signOut().then(function() {
  // Sign-out successful.
}).catch(function(error) {
  alert(error.message)
    });
  }
);

///////////////////////////
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

///////////////////////////
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

///////////////////////////
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

///////////////////////////
function setUpData(){

  $("#uploadingProgress").hide();

  var user = firebase.auth().currentUser
  var userId = user.uid
  
  var userRef = db.collection('partners').doc(user.uid);
  return userRef
    .get()
    .then(doc => {
      if (doc.exists) {
        try{
        userName = doc.get("name")
     
      }catch(error) {
        console.error("Could not retrieve ", error);}
      }

      $("#partnerName").text(userName)
     
      const realFileButton = document.getElementById("dealPhoto");
      const customButton = document.getElementById("choosePhotoButton");
      const customText = document.getElementById("photoText");

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

///////////////////////////
 $("#addDealButton").click(function(){
   var dialog = document.querySelector('#addDealForm');


   if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
    
  }
  dialog.showModal();

 })
///////////////////////////
 $("#addDealProceedButton").click(
  function(){
    var user = firebase.auth().currentUser
    //var userName = $("#profileName").val();
    var userId = user.uid;
    var dealName = $("#dealName").val();
    var dealPartnerName = "";
    var dealValidFrom = $("#dealValidFrom").val();
    var dealValidTill = $("#dealValidTill").val();
    var dealDescription = $("#dealDescription").val();
    var dealTerms = $("#dealTerms").val();
    var dealIsFeatured = false;
    var dealRestaurantLogo = "";
    var isMainAd = false;

     
  var userRef = db.collection('partners').doc(user.uid);
  return userRef
    .get()
    .then(doc => {
      if (doc.exists) {
        dealIsFeatured = doc.get("isFeatured");
        dealPartnerName = doc.get("name");
        dealRestaurantLogo = doc.get("restaurantLogo");

      }})

  }
  );

  ///////////////////////
function readURL(input) {
  if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#dealImage').attr('src', e.target.result);
            $('#previewImage').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
  }
}
///////////////////////
$("#dealPhoto").change(function(){
    readURL(this);
});

//////////////////////
$("#addDealPreviewButton").click(function() {

  var userId = firebase.auth().currentUser.uid;
  var dealIsFeatured = false;
  var dealPartnerName = "";
  var dealName = $("#dealName").val();
 
      
    
  var userRef = db.collection('partners').doc(userId);
  return userRef
    .get()
    .then(doc => {
      if (doc.exists) {

        dealIsFeatured = doc.get("isFeatured");
        dealPartnerName = doc.get("name");

      $("#previewPartnerName").text(dealPartnerName);
      $("#previewName").text(dealName);

        console.log(typeof dealValidFrom);

        var dialog = document.querySelector('#dealPreviewCard');

        if (!dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
          
        }
        dialog.showModal();
       }else {
        alert("Oops something went wrong")
      }
    })

})

$("#addDealProceedButton").click(function() {

  var retVal = confirm("Are you sure you want to proceed and upload the deal?");

  if(retVal == true){

  var dealName = $("#dealName").val();
  var dealDescription = $("#dealDescription").val();
  var dealTerms = $("#dealTerms").val();
  var dealValidFrom = $("#dealValidFrom").datepicker('getDate');
  var dealValidTill = $("#dealValidTill").datepicker('getDate');
  var dealPhoto = "";
  var dealIsFeatured= false;
  var dealId = "";
  

 
  var dealPartnerId = firebase.auth().currentUser.uid;

  
  var firebaseUser = db.collection('partners').doc(dealPartnerId);
 
  return firebaseUser
    .get()
    .then(doc => {
      if (doc.exists) {

        dealIsFeatured = doc.get("isFeatured");

        // Add a new document with a generated id.
        db.collection("deals").add({

        name: dealName,
        description : dealDescription,
        termsOfUse : dealTerms,
        isFeatured : dealIsFeatured,
        partnerID : dealPartnerId,
        active : true,
        validFrom : dealValidFrom,
        validTill : dealValidTill,
        dealPhoto : "",
        mainAd : false

      }).catch(function(error) {
        console.error("Error adding Deal document: ", error);
      })

      .then(function(docRef) {
        dealId = docRef.id
        docRef.update({
          id : dealId
        })})

      .then(function(){
        console.log("Deal added to database ");
        //alert("Your deal was added!")

        var userId = firebase.auth().currentUser.uid

        console.log(userId);

        var storageRef = firebase.storage().ref("/"+userId+"/");
        var file = document.querySelector('#dealPhoto').files[0];
        var fileName  = file.name;

        console.log(fileName);

        var uploadTask = storageRef.child(fileName).put(file);

        uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function(error) {
          // Handle unsuccessful uploads
        }, function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
           

          });
        });








      })
    }})
  }})


/*
        
  
  /*var storageRef = firebase.storage().ref("/"+userId+"/");
  

  var file = document.querySelector('#dealPhoto').files[0];
  var fileName  = file.name;
  

 // console.log(fileName);

 
  var uploadTask = storageRef.child(fileName).put(file);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
    // Handle unsuccessful uploads
    alert("Error uploading file: " + error)
    console.error("Error uploading file: " + error)
  }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
     

      var userRef = db.collection('partners').doc(firebase.auth().currentUser.uid);
      return userRef
          .get()
          .then(doc => {
            if (doc.exists) {
              userRef.update(
                {
                  restaurantLogo : downloadURL,
                  logoFilePath: userId + "/" + fileName
                }
              ).then(function(){

                  console.log("The URL has been updated on the document")
                  alert("Upload success")
                  document.location.reload()
  
                  
                //If document was not written
              }).catch(function(error){
                  console.error("Could not update the URL in the document ")
                   // Create a reference to the file to delete
                   var storageRefDel = firebase.storage().ref('/partnerLogos/' + fileName);

                   // Delete the file
                   storageRefDel.delete().then(function() {
                     console.log("deleted successfully")
                   }).catch(function(error) {
                     // Uh-oh, an error occurred!
              })}
              )

            }}).catch(function(error) {
              console.error("Could not find the document ", error);})
              .then(function(){$("#uploadingProgress").hide();})
              //If uploading error occured
              .catch(function(error){
                console.error("Error uploading file: " + error)
               
              })    
    });
  });

*/
  








  







  


