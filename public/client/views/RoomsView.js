//returns rendered template
var RoomView = Backbone.View.extend({
  template : _.template(
      '<div class="message-display"> \
        <span> \
          <strong><%- room %></strong> \
        </span> \
      </div>'
  ),
  templateAlt : _.template(
      '<div class="message-display">' +
      '<span>' +
      '<strong><%- room %></strong>' +
      '</span>' +
      '</div>'
  ),

  render : function(userLangFlag){
    if (userLangFlag) {
      this.$el.html(this.template(this.model.attributes));
    } else {
      this.$el.html(this.templateAlt(this.model.attributes));
    }
    return this.$el;
  }
});

var RoomsView = Backbone.View.extend({

  initialize : function(){
    var collection = this.collection;
    this.collection.on('add', this.render, this);
    this.collection.on('remove', this.render, this);

    socket.emit('get rooms', 'Need rooms.');

    //toggle display users' language
    //this.userLangFlag = true;
    //vent.on('click:dispLang', _.bind(this.displayUserLanguage, this));

    //socket.io listener for emits
    socket.on('new room', function(room){
      //adds message to collection
      console.log(room);
      //var userLang = $('#lang').val();
      //list.text = list.translations[userLang];
      //collection.addlist(list);
    });

    //storage variable for displayed messages
    this.activeRooms = {};
  },

  render : function () {
    var listHtml = ""
    this.collection.forEach(function(val, key, list) {
      listHtml += this.renderRoom;
    }, this);

    this.$el.html(listHtml);
  },

  renderRoom : function(room) {
    var roomView = new RoomView ({model : room});
    return roomView.render();
  }
});
