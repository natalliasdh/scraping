var thisId;
var delid;

$.getJSON("/news", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#news").append("<div class='card bg-light text-dark'><div class='card-body' data-id='" + data[i]._id+"' ><img src='" + data[i].img + "' class='img-fluid'> <a href='" + data[i].link + "'>" + data[i].title + "</a><br><br><button id='comment' type='button' class='btn btn-warning' data-id='" + data[i]._id + "'>Comments</button></div></div><br>");
    }
});

$(document).on("click", "#comment", function () {
    // Empty the notes from the note section
    console.log(this);
    $("#notes").empty();
    // Save the id from the p tag
    thisId = $(this).attr("data-id");
    
    f1(thisId);
});

function f1(thisId) {
console.log(thisId);

$("#notes").empty();
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/news/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h6>" + data.title + "</h5>");
            $("#notes").append("<hr>");
            for(let i=0;i<data.note.length;i++)
            {$("#notes").append("<h5>" + data.note[i].title+": " + data.note[i].body+" "+"<button id='del' data-id='" + data.note[i]._id +"' data-idn='" + data._id +"' class='btn btn-danger'>X</button></h5>");}
            // An input to enter a new title
            $("#notes").append("Name: <br/><input id='titleinput' name='title' ><br/>");
            // A textarea to add a new note body
            $("#notes").append("Comments: <br/><textarea id='bodyinput' name='body'></textarea><br/><br/>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-warning'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
    }

$(document).on("click", "#savenote", function add() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/news/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });


  $(document).on("click", "#del", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    delid=$(this).attr("data-idn");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "DELETE",
      url: "/notes/" + thisId,
      
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
    
      console.log(delid);
        f1(delid);
        // Empty the notes section
        
      });
  
    // Also, remove the values entered in the input and textarea for note entry
   
  });
