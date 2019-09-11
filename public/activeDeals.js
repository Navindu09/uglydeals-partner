
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
    document.location.reload();
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
  
  const grid = document.querySelector("#gridDiv");

  
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

          $("#partnerName").show().text(userName);
  

       
        }catch(error) {
          console.error("Could not retrieve ", error);}
        }

        db.collection("partners").doc(userId).collection("activeDeals").get()
        .then(function(querySnapshot) {
           
            if(querySnapshot.size === 0){
              $("#activeDealsTitle").show();
            }
            //querySnapshot.get(1);
            querySnapshot.forEach(function(doc) {
                grid.innerHTML +="<div id="+ doc.data().id +"  class='mdl-cell'> <div class='mdl-card mdl-shadow--2dp demo-card-square'> <img src=' " + doc.data().dealPhoto + "'> </img><div class='mdl-card__title mdl-card--expand'> <h5>" + doc.data().name + "</h5> </div><div class='mdl-card__actions mdl-card--border'><span><a id = 'editButton' class='mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect'>Edit</a> <a id='endButton' class='mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect'> End</a></span></div></div></div>";
                
            
             });

        });

        const realFileButton = document.getElementById("dealPhoto");
        const customButton = document.getElementById("choosePhotoButton");
        const customText = document.getElementById("photoText");
  
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

 
 
 //EDIT BUTTON clicked
  $("#gridDiv").click( function(event) {

    if(event.target.id == "editButton")
    {
      console.log(true);
      dealId = $(event.target).parent().parent().parent().parent().attr('id');
      console.log(dealId);
      
      var dialog = document.querySelector('#editDealForm');
  
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
  
        }

       dialog.showModal();
       loadDealData(dealId);
       getNumberOfRedeems(dealId)
                      
                     
    }
  
  })

function loadDealData(dealId){

  userId = firebase.auth().currentUser.uid;
  var dealDoc = db.collection("partners").doc(userId).collection("activeDeals").doc(dealId)
  dealDoc.get().then(function(doc){
    if (doc.exists){
      //console.log(doc.data())

        $("#dealName")[0].parentElement.MaterialTextfield.change(doc.get("name"));
        $("#dealDescription")[0].parentElement.MaterialTextfield.change(doc.get("description"));
        $("#dealTerms")[0].parentElement.MaterialTextfield.change(doc.get("termsOfUse"));
        $("#dealId")[0].parentElement.MaterialTextfield.change(doc.get("id"));

        var timeStampValidFrom = doc.get("validFrom");
        var validFrom = timeStampValidFrom.toDate();
       
        var timeStampValidTill = doc.get("validTill");
        var validTill = timeStampValidTill.toDate();

        $("#dealId").text(dealId);
        var text = $("#dealId").text();
        console.log();

        $("#dealValidFrom").datepicker("setDate", validFrom) ;
        $("#dealValidTill").datepicker("setDate", validTill) ; 

        //$("#dealValidTill")[0].change(doc.get("validTill"));
        $("#dealImage").attr('src', doc.get("dealPhoto"))
        
    } else {
      console.log("No such deal!")
    }

  })

   
}

function getNumberOfRedeems(dealId){

  userId = firebase.auth().currentUser.uid;


  var counter = 0;
  

  db.collection("redeemedDeals").get()
      .then(function(querySnapshot){
        querySnapshot.forEach(function(doc) {
        
        var data = doc.data();
        var docDealID = data.deal;

        console.log(docDealID);
      
        if (dealId == docDealID){
            counter = counter + 1;
        }
      });
    }).then(function(){
      //console.log(counter);
      $("#scanInput")[0].parentElement.MaterialTextfield.change(counter);
    })
  
  
}

 $("#updateButton").click(function(){ 

 $("#addDeal :input").prop("disabled", true);
 var userId = firebase.auth().currentUser.uid;

 document.getElementById("updateButton").disabled = true;
 $("#uploadingDealProgress").show();
 document.getElementById("cancelButton").disabled = true;
 document.getElementById("choosePhotoButton").disabled = true;

 var name1 = $("#dealName").val();
 var description1 = $("#dealDescription").val();
 var termsOfUse1 = $("#dealTerms").val();
 var validFrom1 = $("#dealValidFrom").datepicker("getDate");
 var validTill1 = $("#dealValidTill").datepicker("getDate");
 var id1 = $("#dealId").val();
 var photo = $("#dealImage").attr("src");
  
 
 //1: Update the document with changes
 var activeDeal = db.collection("partners").doc(userId).collection("activeDeals").doc(id1);
 activeDeal.update({
   name : name1,
   description : description1,
   termsOfUse : termsOfUse1,
   validFrom : validFrom1,
   validTill : validTill1,
   lastUpdated : firebase.firestore.FieldValue.serverTimestamp()
   
 }).catch(function(error){
   console.log("Updating document failed")
 }).then(function(){

    console.log("activeDeals updated")

    activeDeal.get().then(function(doc){
      if(doc.exists){

        // 2: Delete old photo
        var activeDealPhoto = doc.get("dealPhoto")

        if(!(photo === activeDealPhoto)){

          var dealPhotoPath = doc.get("photoFilePath");

          
          var storageRef = firebase.storage().ref(dealPhotoPath);

          // Delete the file
          storageRef.delete().then(function() {
            console.log("Previous file has been deleted")

            var userId = firebase.auth().currentUser.uid;

            var uploadFile = firebase.storage().ref("/"+userId+"/");
            var file = document.querySelector('#dealPhoto').files[0];
            var fileName  = file.name;
    
            
    
            var uploadTask = uploadFile.child(fileName).put(file);
            // 3 : Uploading new file
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
                  console.log("Error uploading file")
                  docRef.delete().then(function() {
                  console.log("Document successfully deleted!");
                  }).catch(function(error) {
                      console.error("Error removing document: ", error);
                  });
            }, function() {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                  console.log("Photo uploaded successfully")
                  //Updating active deal with URL and File path
                  activeDeal.update({
                    dealPhoto : downloadURL,
                    photoFilePath : userId + "/" + fileName

                  }).catch(function(error){
                    console.log("Error updating dealPhoto and File Path")
                    

                  }).then(function(){
                   
                    // 4: Updating dealDocument
                    activeDeal.get().then(function(doc){
                      if(doc.exists){
                        
                        db.collection("deals").doc(doc.id).update({

                          name : doc.get("name"),
                          description : doc.get("description"),
                          termsOfUse : doc.get("termsOfUse"),
                          validFrom : doc.get("validFrom"),
                          validTill : doc.get("validTill"),
                          dealPhoto : doc.get("dealPhoto"),
                          photoFilePath : doc.get("photoFilePath"),
                          lastUpdated: doc.get("lastUpdated")
                        
                        }).catch(function(){
                          console.log("Error updating dealDocument")

                        }).then(function(){
                          console.log ("The deal has been updated")
                          alert("The deal has been updated successfully");
                          document.location.reload();
                        })
  

                      }else {
                        console.log("Could not find dealDocument")
                      }
                      
                    })
                  })

                })
              
              })

            
          }).catch(function(error) {
            console.log("Error when deleting file")
          });


        }else {
         
            activeDeal.get().then(function(doc){
                      if(doc.exists){
                        
                        db.collection("deals").doc(doc.id).update({

                          name : doc.get("name"),
                          description : doc.get("description"),
                          termsOfUse : doc.get("termsOfUse"),
                          validFrom : doc.get("validFrom"),
                          validTill : doc.get("validTill"),
                          dealPhoto : doc.get("dealPhoto"),
                          photoFilePath : doc.get("photoFilePath"),
                          lastUpdated: doc.get("lastUpdated")
                        
                        }).catch(function(){
                          console.log("Error updating dealDocument")
                          
                        }).then(function(){
                          console.log ("The deal has been updated")
                          alert("The deal has been updated successfully");
                          document.location.reload();
                        })
  

                      }else {
                        console.log("Could not find dealDocument")
                      }
                      
                    })
          
        }

      }else {
        console.log("No such file")
      }

    //
    })
    

 })











})


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

$("#dealPhoto").change(function(){
  readURL(this);
});



$("#cancelButton").click(function(ev){

  ev.preventDefault();

        var dialog = document.querySelector("#editDealForm");

        if (!dialog.showModal) 
        {
          dialogPolyfill.registerDialog(dialog);
        }

        document.getElementById("updateButton").disabled = true;
        dialog.close();
        
})


$("#editDealForm").on('input change', function() {
  $('#updateButton').attr('disabled', false);
});

$("#gridDiv").click( function(event) {

 

  userId = firebase.auth().currentUser.uid;

  if(event.target.id == "endButton")
  {
   
    dealId = $(event.target).parent().parent().parent().parent().attr('id');
    
    
    var retVal = confirm("Are you sure you want to end this deal?");
    
        if(retVal == true){

            var dialog = document.querySelector('#greyScreen');
                                          
            if (!dialog.showModal) {
              dialogPolyfill.registerDialog(dialog);
              
            }
            dialog.showModal();
        

            // 1. Deactivating deal in Deals collection
            var dealDocument = db.collection("deals").doc(dealId);
            dealDocument.update({

              active : false,
              dealEndTimestamp : firebase.firestore.FieldValue.serverTimestamp() //Setting the ended time stamp

            }).catch(function(error){
              console.log("Deal update failed")
            })
            
            .then(function(){ //Function 2: Add the deal to deal history

                console.log("Deal deactivated")
                //console.log(dealId)
                //console.log(userId)
                
                //Adding DealId to deals history
                db.collection("partners").doc(userId).collection("dealHistory").doc(dealId).set({})
                .then(function(){

                  console.log("DealId added to deal history")
                  //console.log(typeof dealDocument)


                }).catch(function(error){

                      //Re Activate deal
                      dealDocument.update({

                        active : true,
                        dealEndTimestamp : ""

                      })
                      .then(function(){

                        console.log("Could not set deal in deal history, Deal has been reactivated");


                      }).catch(function(error){

                        console.log("Could not set deal in deal history, Deal couldnt be reactivated", error);

                        alert("Could not end the deal, Please contact Ugly Deals to resolve this issue.");
                      })

                }).then(function(){ // Function 3 : Delete the activedeal Document
                  
                  //Delete document from activeDeals collection
                  var activeDealDocument = db.collection("partners").doc(userId).collection("activeDeals").doc(dealId);
                  activeDealDocument.delete()
                  .then(function(){

                    console.log("Active deal document has been deleted successfully!");
                    alert("Deal has been Ended successfully");
                    document.location.reload();


                  }).catch(function(error){

                        console.log("Active deal could not be deleted")
                        
                        //Re Activate deal
                        dealDocument.update({

                          active : true,
                          dealEndTimestamp : ""

                        })
                        .then(function(){

                          console.log("Could not set deal in deal history, Deal has been reactivated");
                          
                          //Delete the dealHistoty document
                          var dealHistoryDocument = db.collection("partners").doc(userId).collection("dealHistory").doc(dealId);
                          dealHistoryDocument.delete()
                          .then(function(){

                            console.log("dealHistory document has been deleted")
                            alert("Deal could not be Ended!")

                          }).catch(function(error){
                            console.log("dealHistory document could not be deleted!")
                            alert("Deal could not be ended. Please contact Ugly Deals to resolve this issue.")
                          })

                        }).catch(function(error){

                          console.log("Could not set deal in deal history, Deal couldnt be reactivated", error);

                          alert("Could not end the deal, Please contact Ugly Deals to resolve this issue.");

                        })

                  })


                })
                
              
            })
     
        } else {
         //does not exist
        }

         

  }
                   
})

function deleteDealPhoto(dealId){
  var desertRef = storageRef.child('images/desert.jpg');

    // Delete the file
    desertRef.delete().then(function() {
      // File deleted successfully
    }).catch(function(error) {
      // Uh-oh, an error occurred!
    });

    
}

$("#generateQR").click(function(ev){
  ev.preventDefault();

  var id = $("#dealId").val();
  //console.log(id)

  var dialog = document.querySelector('#qrDialog');
                                        
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
    
  }
  dialog.showModal();

  var qr = new QRious({
    
          element: document.getElementById('qr'),
          size : 300,
          value: id
    
    }); 


})

$("#downloadQRButton").click(function(){
    
  var canvas = document.getElementById("qr");
  image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = "qrCode.png";
  link.href = image;
  link.click();
  document.location.reload()


});

$("#doneButton").click(function(){
  
  
  document.location.reload()


});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

