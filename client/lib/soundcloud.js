Session.set('soundcloudReady', false);
Session.set('soundcloudScriptReady', false);
Meteor.startup(function() {
  $.getScript('http://connect.soundcloud.com/sdk.js', function() {
    // script has loaded
    Session.set('soundcloudScriptReady', true);
  });
});

Template.registerHelper("soundcloudReady", function() {
  return Session.get('soundcloudReady');
});

Tracker.autorun(function() {
  if (Session.get('soundcloudScriptReady')) {
    SC.initialize({
      client_id: 'e344df0ad24a6a0e44538b0049e264c9',
      redirect_uri: "http://localhost:3000/"
    });
    Meteor.setTimeout(function() {
      Session.set('soundcloudReady', true);
    }, 1000);
  }
});
