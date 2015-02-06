var Rooms = require('../db/models/Room.js');
var translator = require('./translator.js');

var ChatHandler = function(){};

//translate/emit message
ChatHandler.prototype.prepareMessage = function(msg, callback){
  var room = msg.room;
  room = room || 'lobby';
  Rooms.findOne({room: room}, function(err, room){
    err && console.error(err, 'error finding room!');
    translator.translate(msg, room, function(err, results){
      if(err){
        console.error('error translating: ', err);
        callback(err);
      }
      msg.translations = results;
      callback(msg);
    });
  });
};

//return list of rooms
ChatHandler.prototype.getRooms = function(callback){
  Rooms.find({}, function(err, rooms) {
    var roomList = [];

    rooms.forEach(function(room) {
      roomList.push({room: room.room, lang: room.lang});
    });

    callback(roomList);
  });
};

// This accepts strings as arguments, will create or join joinRoom 
// and increment language counter
ChatHandler.prototype.joinRoom = function(joinRoom, lang, callback){
  Rooms.findOne({room: joinRoom}, function(err, room){
    err && console.error(err, 'error finding room to join!');
    // if room doesn't exist, make new room
    if(room === null){
      var language = {};
      language[lang] = 1;
      room = new Rooms({
        room: joinRoom,
        lang: language,
        connections: 1
      }) 
    } else {
      // If language exists in room.lang, add 1 to user counter
      // else initiate new language property to 1
      room.lang[lang] = (room.lang[lang]) ? room.lang[lang] + 1 : 1;
      room.markModified('lang');
      room.connections++;
    }
    room.save(function(err) {
      if (err) throw err;

      if(callback){
        callback(room);
      }
    });
  });
};

// This accepts strings as arguments, will leave leaveRoom 
// and decrement language counter. 
ChatHandler.prototype.leaveRoom = function(leaveRoom, lang, callback){
  Rooms.findOne({room: leaveRoom}, function(err, room){
    err && console.error('FATAL: error finding room to leave!');
    //subtract connection counter
    room.connections--;
    if(room.connections === 0){
      //delete room if no users left:
      room.remove(function(err) {
        if (err) throw err;

        callback && callback(room);
      });
    } else {
      //remove language counter 
      room.lang[lang]--;
      room.markModified('lang');
      room.save(function(err) {
        if (err) throw err;

        callback && callback(room);
      });
    }

  });
};

ChatHandler.prototype.changeLanguage = function(oldLang, newLang, currentRoom){
  Rooms.findOne({room: currentRoom}, function(err, room){
    err && console.error('error finding room for changing language');
    room.lang[oldLang]--;
    // If language exists in room.lang, add 1 to user counter 
    // else initiate new language property to 1
    room.lang[newLang] = room.lang[newLang] ? room.lang[newLang] + 1 : 1;
    room.markModified('lang');
    room.save();
  });
};

module.exports = new ChatHandler();
