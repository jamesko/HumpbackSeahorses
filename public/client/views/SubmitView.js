//handles message function
var SubmitView = Backbone.View.extend({

  events: {
    'submit' : 'handleSubmit',
    'change #lang' : 'changeLanguage',
    'click #roomButton' : 'changeRoom',
    'keyup #chatInput' : 'emitChangesInTypingStatus'
  },

  initialize: function(){},

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
    var typingStatus = $("form").find("div");
    var typingFlag = ". . .";

    //do nothing if just typing while typing status is already true
    if(e.type==="keyup" && typingStatus.html()===typingFlag && $('#chatInput').val()!==""){
      return;
    }
    if(e.type==="keyup" && typingStatus.html()===""){
      console.log("2nd");
      typingStatus.html(typingFlag);
      //TODO: emit typingStatus as true! {username, room and status = true}
      return
    }
    //check if user cleared input with a backspace
    if(e.type==="keyup" && $('#chatInput').val()==="" && typingStatus.html() === typingFlag){
      typingStatus.empty();
      //TODO: emit typingStatus as false! {username, room and status = false}
      return;
    }
    //TODO & Comment: when submitting: rely on receipt of ...
    //...submitted msg as signal to set typingstatus to false
    if(e.type==="submit"){
      typingStatus.empty();
      return;
    }
  }

});
