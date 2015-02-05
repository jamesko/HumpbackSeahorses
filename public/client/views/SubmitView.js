//handles message function
var SubmitView = Backbone.View.extend({

  events: {
    'submit' : 'handleSubmit',
    'change #lang' : 'changeLanguage',
    'click #roomButton' : 'changeRoom',
    'keyup #chatInput' : 'emitChangesInTypingStatus'
  },

  initialize: function(){
      socket.on('user typing', function(data){
        //TODO: modify specified user's typing status as found in data
      });
  },

  handleSubmit: function(e){
    e.preventDefault();
    var message = {
      text: $('#chatInput').val(),
      lang: $('#lang').val(),
      username: $('#username').val(),
      room: $('#room').val()
    };
    socket.emit('chat message', message);
    $('#chatInput').val('');
    this.emitChangesInTypingStatus(e);
  },

  changeLanguage: function(e){
    e.preventDefault();
    console.log('changing language');
    socket.emit('change language', $('#lang').val());
  },

  changeRoom : function(e){
    e.preventDefault();
    var room = $('#room').val();
    var lang = $('#lang').val();
    socket.emit('join room', {room: room, lang: lang});
  },

  emitChangesInTypingStatus : function(e){
    e.preventDefault();
    var typingStatus = $("#typingStatus");
    var isChatInput = $('#chatInput').val() !== "";
    var typingFlag = ". . .";

    //do nothing if just typing while typing status is already true
    if(e.type === "keyup" && typingStatus.html() !== "" && isChatInput){
      return;
    }

    var burst = function(isTyping){
      var statusBurst = {
        username: $('#username').val(),
        room: $('#room').val() || 'lobby',
        status: isTyping,
        connection_ID: socket.id
      }
      socket.emit('user typing', statusBurst);
    }

    //check if input is now not null and typing status is false
    if(e.type === "keyup" && typingStatus.html() === "" && isChatInput){
      typingStatus.html(typingFlag);
      burst(true);
      return
    }
    //check if user cleared input with a backspace
    if(e.type === "keyup" && !isChatInput && typingStatus.html() !== ""){
      typingStatus.empty();
      burst(false);
      return;
    }
    //TODO & Comment: when submitting: rely on receipt of ...
    //...submitted msg as signal to set typingstatus to false
    if(e.type === "submit"){
      typingStatus.empty();
      return;
    }
  }

});
