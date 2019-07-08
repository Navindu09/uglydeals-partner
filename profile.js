
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

   ///////////////////////////////
  function setUpData(){
  
    $("#uploadingProgress").hide();
  
  
  
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
    var logoURL = "";
  
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
          logoURL = doc.get("restaurantLogo")
   
        }catch(error) {
          console.error("Could not retrieve ", error);}
        }
  
        $("#partnerName").text(userName)
        var logoImage = document.getElementById('logoImage');
        logoImage.src = logoURL
  
        
        
  
  
  
        $("#profileName")[0].parentElement.MaterialTextfield.change(userName);
        $("#profileEmail")[0].parentElement.MaterialTextfield.change(userEmail);
        $("#profileTelephone")[0].parentElement.MaterialTextfield.change(userTelephone);
        $("#profileLocation")[0].parentElement.MaterialTextfield.change(userLocation);
        $("#profileFeatured")[0].parentElement.MaterialTextfield.change(userIsFeatured);
        $("#profileManagerName")[0].parentElement.MaterialTextfield.change(userMangerName);
        $("#profileManagerTelephone")[0].parentElement.MaterialTextfield.change(userMangerTelephone);
        $("#profileManagerEmail")[0].parentElement.MaterialTextfield.change(userManagerEmail);
  
        var saveButton = document.getElementById('profileSaveButton'); 
        saveButton.disabled = false; 

        var chooseFileButton = document.getElementById('chooseFileButton'); 
        chooseFileButton.disabled = false; 
  
  
  
         const realFileButton = document.getElementById("profileLogo");
         const customButton = document.getElementById("chooseFileButton");
         const customText = document.getElementById("fileText");
  
         customButton.addEventListener("click",function(ev){
          ev.preventDefault();
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

  ///////////////////////////////
  $("#profileSaveButton").click(
    
    function(){

      $("#uploadingProgress").show();


      var saveButton = document.getElementById('profileSaveButton'); 
      saveButton.disabled = true;

      var chooseFileButton = document.getElementById('chooseFileButton'); 
      chooseFileButton.disabled = true;


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
          document.location.reload()
          
          }).catch(function(error) {
          console.error("Error writing document: ", error);
      });
  
    
     
      }
   }) });
  
  
  ///////////////////////////////
   $("#profileLogo").on("change", function(event){
  
    $("#submitFileButton").show();
  
   });
  
   $("#submitFileButton").click(function (ev){
     
    ev.preventDefault();

    deleteOldLogo();
    uploadFile(); 
    
  
   });
  ///////////////////////////////
   function uploadFile(){
    // Create a root reference
  
        
        var userId = firebase.auth().currentUser.uid;
        var storageRef = firebase.storage().ref("/"+userId+"/");
        
  
        var file = document.querySelector('#profileLogo').files[0];
        var fileName  = file.name;
        var metadata = { contentType: file.type };
  
        console.log(fileName);
        $("#submitFileButton").hide();
        $("#uploadingProgress").show();
        $("#profileSaveButton").hide();
        $("#chooseFileButton").hide();
  
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
   
    }
  ///////////////////////////////
    function deleteOldLogo(){
      var userId = firebase.auth().currentUser.uid;
     
  
      var userRef = db.collection('partners').doc(userId);
      return userRef
      .get()
      .then(doc => {
        if (doc.exists) {
          
         
           var filePath = doc.get("logoFilePath")
           var storageRef = firebase.storage().ref(filePath);
           
           storageRef.delete().then(function() {
           
            console.log("Delete success")
          }).catch(function(error) {
            console.log("error deleting")
          });
           
        }
      })
    }
  
  
    
  
  
  