$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html =
       `<div class="messages__box" data-message-id=${message.id}>
          <div class="messages__box__upper-info">
            <div class="messages__box__upper-info__talker">
              ${message.user_name}
            </div>
            <div class="messages__box__upper-info__date">
              ${message.created_at}
            </div>
          </div>
          <div class="messages__box__text ">
            ${message.content}
           </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      var html =
       `<div class="messages__box" data-message-id=${message.id}>
          <div class="messages__box__upper-info">
            <div class="messages__box__upper-info__talker">
              ${message.user_name}
            </div>
            <div class="messages__box__upper-info__date">
              ${message.created_at}
            </div>
          </div>
          
         <div class="messages__box__text">
           ${message.content}
          </div>
       </div>`
      return html;
    };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});      
      $('form')[0].reset();
     })
    .fail(function(data){
      alert('メッセージ送信に失敗しましたr');
      })

    .always(function() {
     $('.submit-btn').prop('disabled', false);
    })  
  })

  var reloadMessages = function() {
    last_message_id = $('.messages__box:last').data("message-id");
     $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
       if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      console.log('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});