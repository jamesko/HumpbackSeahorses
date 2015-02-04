var Rooms = Backbone.Collection.extend({

  model: Room,

  //instantiate new model
  //add model to collection
  addRoom: function(room){
    var room = new Room({
      lang: room.lang,
      room: room.room,
      translations: room.translations
    });
    this.add(room);
  }

});
