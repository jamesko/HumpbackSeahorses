//returns rendered template
var MessageView = Backbone.View.extend({
  template : _.template(
    '<div class="message-display"> \
      <span> \
        <strong><%- username %><% if (this.userLangFlag){ %> [<%= lang.toUpperCase()%>]<% } %> \
      </strong>@<%- room %> - <%- text %> \
      </span> \
    </div>'
    ),

  render : function(userLangFlag){
      this.userLangFlag = userLangFlag;
      this.$el.html(this.template(this.model.attributes)) ;
    return this.$el;
  }
});

var MessagesView = Backbone.View.extend({

  initialize : function(){
    var collection = this.collection;
    this.collection.on('add', this.render, this);

    //toggle display users' language
    this.userLangFlag = !!$('#dispLang').attr('checked');
    vent.on('click:dispLang', this.displayUserLanguage, this);

    //socket.io listener for emits
    socket.on('chat message', function(msg){
      //adds message to collection
      var userLang = $('#lang').val();
      msg.text = msg.translations[userLang];
      collection.addmsg(msg);
    });

    //storage variable for displayed messages
    this.onscreenMessages = {};
  },

  render : function (flag) {
    flag ? this.collection.forEach(this.renderMessage, this) :
           this.collection.forEach(this.reRenderMessage, this);
  },

  renderMessage : function(message) {
    //message.cid is unique client-only id
   if (!this.onscreenMessages[message.cid]) {
      var messageView = new MessageView ({model : message});
      this.$el.append (messageView.render(this.userLangFlag));
      this.onscreenMessages[message.cid] = true;
      $('#messagesView').scrollTop(2000);
    }
  },

  displayUserLanguage : function(checked){
    this.userLangFlag = checked;
    $('#messagesView').empty();
    this.render(false);

  },

  reRenderMessage : function(message) {
      var messageView = new MessageView ({model : message});
      this.$el.append (messageView.render(this.userLangFlag));
      this.onscreenMessages[message.cid] = true;
      $('#messagesView').scrollTop(2000);
  }
});