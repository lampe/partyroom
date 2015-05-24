Meteor.publish("pr", function(_id){
  return PR.find({_id: _id});
});
Meteor.publish("prs", function(){
  return PR.find({});
});
