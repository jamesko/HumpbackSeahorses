//setup backbone message model
var Message = Backbone.Model.extend({
  defaults:{
    user_id: '',
    username:'',
    text: '',
    room:'',
    lang: 'en',
    translations: {}
  }
});
