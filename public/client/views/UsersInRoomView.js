var UsersInRoomView = Backbone.View.extend({
  el: $('#usersInRoom'),

  initialize: function(){
    this.collection.on("add", this.render, this);
  },

  render: function(){

    var names = _.uniq(this.collection.map(function(message){
      return message.get("username");
    }));

    this.$el.empty();
    names.forEach(function(name){
      this.$el.append('<li style="list-style: none">' + name + '</li>');
    }, this)

  }
});
