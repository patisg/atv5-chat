const socket = io();

let username = '';
let userList = [];
let chatSelecionado= 0;

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');
let buttonChatPage = document.querySelector('#buttonChatPage');
let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');
let botaoSala1 = document.querySelector('#botaoSala1');
let botaoSala2 = document.querySelector('#botaoSala2');

buttonChatPage.style.display = 'flex';
loginPage.style.display = 'none';
chatPage.style.display = 'none';

botaoSala1.addEventListener('click', function() {
    chatSelecionado = 1;
    loginPage.style.display = 'flex';
    buttonChatPage.style.display = 'none';
});

botaoSala2.addEventListener('click', function() {
    chatSelecionado = 2;
    loginPage.style.display = 'flex';
    buttonChatPage.style.display = 'none';
});
function renderUserList(){
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(i =>{
        ul.innerHTML += '<li>'+i+'</li>';
    });
}
function addMessage(type,user,msg){
    
    alert("entrou no addMessage-msg");
    let ul = document.querySelector('.chatList');

    switch(type){
        case 'status':
            ul.innerHTML+='<li class="m-status">'+msg+'</li>';
            break;
        case 'msg':
            if(username==user){
                ul.innerHTML += '<li class ="m-txt"><span class="me">'+user+'</span>'+msg+'</li>';
            }else{
                ul.innerHTML += '<li class ="m-txt"><span>'+user+'</span>'+msg+'</li>';
            }                
            break;
    }
    ul.scrollTop = ul.scrollHeight;
}
loginInput.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        let name = loginInput.value.trim();
        if(name!= ''){
            username=name;
            document.title = 'Chat('+chatSelecionado+')  ('+username+')';
            socket.emit('join-request', username,chatSelecionado);
        }
    }
});
textInput.addEventListener('keyup', (e)=>{
    console.log("aaa> "+e.keyCode );
    if(e.keyCode === 13){
        let txt = textInput.value.trim();
        textInput.value = '';

        if(txt != ''){
            addMessage('msg', username,txt);
            socket.emit('send-msg',txt);
        }
    }
});
socket.on('user-ok', (list)=>{
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    textInput.focus();

    addMessage('status', null, 'Conectado!');

    userList = list;
    renderUserList();
});
socket.on('list-update', (data)=>{
    if(data.joined){
        addMessage('status', null, data.joined+' entrou no chat.');
    }
    if(data.left){
        addMessage('status', null, data.left+' saiu do chat.');
    }
    userList = data.list;
    renderUserList();
})

socket.on('show-msg', (data)=>{
    addMessage('msg', data.username, data.message);
});
socket.on('disconnect', ()=>{
    addMessage('status', null, 'Você foi desconectado!');
    userList=[];
    renderUserList;

});
socket.on('reconnect_error', ()=>{
    addMessage('status', null, 'Tentando reconectar...');
});
socket.on('reconnect', ()=>{
    addMessage('status', null, 'Reconectado!');
    if(username!=''){
        socket.emit('join-request', username,chatSelecionado);
    }

});